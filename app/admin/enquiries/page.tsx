"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Eye,
  MessageSquareText,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/common/ToastProvider";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { useLanguage } from "@/context/LanguageContext";
import { ENQUIRY_TRANSLATIONS } from "@/data/enquiries";
import { enquiryService } from "@/services/media-enquiry-service";
import { useWebsiteContent } from "@/services/use-store-data";
import { Enquiry, EnquiryStatus } from "@/types";

export default function AdminEnquiriesPage() {
  const { content } = useWebsiteContent();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isTa = language === "ta";

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<"all" | EnquiryStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null);

  const loadEnquiries = () => {
    setLoading(true);
    try {
      setEnquiries(enquiryService.getAll());
    } catch (e) {
      console.error("Failed to fetch enquiries", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enquiries.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (q) {
        return (
          e.customerName.toLowerCase().includes(q) ||
          e.phoneNumber.toLowerCase().includes(q) ||
          e.message.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [enquiries, statusFilter, search]);

  const counts = useMemo(
    () => ({
      all: enquiries.length,
      new: enquiries.filter((e) => e.status === "new").length,
      contacted: enquiries.filter((e) => e.status === "contacted").length,
      resolved: enquiries.filter((e) => e.status === "resolved").length,
    }),
    [enquiries]
  );

  const handleStatusChange = async (id: string, nextStatus: EnquiryStatus) => {
    try {
      enquiryService.updateStatus(id, nextStatus);
      setEnquiries(enquiryService.getAll());
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: nextStatus });
      }
      showToast(isTa ? "விசாரணை நிலை மாற்றப்பட்டது" : "Enquiry status updated", {
        description:
          nextStatus === "new"
            ? isTa
              ? "புதியது"
              : "New"
            : nextStatus === "contacted"
            ? isTa
              ? "தொடர்புகொள்ளப்பட்டது"
              : "Contacted"
            : isTa
            ? "தீர்க்கப்பட்டது"
            : "Resolved",
      });
    } catch {
      showToast(isTa ? "நிலையை மாற்றுவதில் பிழை" : "Failed to update status", { type: "danger" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      enquiryService.remove(deleteTarget.id);
      setEnquiries(enquiryService.getAll());
      showToast(isTa ? "விசாரணை நீக்கப்பட்டது" : "Enquiry deleted", { type: "info" });
    } catch {
      showToast(isTa ? "விசாரணையை நீக்குவதில் பிழை" : "Failed to delete enquiry", { type: "danger" });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <AdminShell
      title={isTa ? "வாடிக்கையாளர் விசாரணைகள்" : "Customer Enquiries"}
      subtitle={
        isTa
          ? "தொடர்பு பக்கம் வழியாக வாடிக்கையாளர்கள் அனுப்பிய கோரிக்கைகள் மற்றும் விசாரணைகளை நிர்வகித்தல்"
          : "Manage customer questions, messages, and order enquiries submitted through the contact page"
      }
      actions={
        <button
          type="button"
          onClick={loadEnquiries}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#287A45] ${loading ? "animate-spin" : ""}`} />
          <span>{isTa ? "விசாரணைகளைப் புதுப்பி" : "Refresh Enquiries"}</span>
        </button>
      }
    >
      <div className="space-y-5">
        {/* Filter Pills & Search */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {(["all", "new", "contacted", "resolved"] as const).map((status) => {
              const label =
                status === "all"
                  ? isTa
                    ? "அனைத்தும்"
                    : "All"
                  : status === "new"
                  ? isTa
                    ? "புதியது"
                    : "New"
                  : status === "contacted"
                  ? isTa
                    ? "தொடர்புகொள்ளப்பட்டது"
                    : "Contacted"
                  : isTa
                  ? "தீர்க்கப்பட்டது"
                  : "Resolved";

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    statusFilter === status
                      ? "bg-[#287A45] text-white shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:bg-[#EDF7EE] hover:text-[#287A45] border border-slate-200/80"
                  }`}
                >
                  {label} ({counts[status]})
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isTa ? "பெயர் அல்லது அலைபேசி எண்..." : "Search by customer name or phone..."}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#287A45]"
            />
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquareText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">
                {isTa ? "விசாரணைகள் எதுவும் கிடைக்கவில்லை" : "No enquiries found"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isTa
                  ? "வாடிக்கையாளர்கள் இணையதளம் வழியாக அனுப்பும் செய்திகள் இங்கு தோன்றும்."
                  : "Customer contact messages will appear here once submitted."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">{isTa ? "வாடிக்கையாளர்" : "Customer"}</th>
                    <th className="py-3 px-4">{isTa ? "அலைபேசி எண்" : "Phone Number"}</th>
                    <th className="py-3 px-4">{isTa ? "செய்தி முன்னோட்டம்" : "Message Preview"}</th>
                    <th className="py-3 px-4">{isTa ? "தேதி" : "Date"}</th>
                    <th className="py-3 px-4">{isTa ? "நிலை" : "Status"}</th>
                    <th className="py-3 px-4 text-right">{isTa ? "விரைவுத் தொடர்பு & செயல்கள்" : "Quick Contact & Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((enq) => {
                    const cleanPhone = enq.phoneNumber.replace(/[^0-9]/g, "");
                    const isNew = enq.status === "new";
                    const isContacted = enq.status === "contacted";
                    const displayName = !isTa
                      ? (enq.customerNameEn || ENQUIRY_TRANSLATIONS[enq.id]?.nameEn || ENQUIRY_TRANSLATIONS[enq.customerName]?.nameEn || enq.customerName)
                      : enq.customerName;
                    const displayMessage = !isTa
                      ? (enq.messageEn || ENQUIRY_TRANSLATIONS[enq.id]?.messageEn || ENQUIRY_TRANSLATIONS[enq.customerName]?.messageEn || enq.message)
                      : enq.message;

                    return (
                      <tr key={enq.id} className="hover:bg-[#EDF7EE]/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {displayName}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                          {enq.phoneNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-xs text-slate-600 line-clamp-1 max-w-xs">{displayMessage}</p>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                          {new Date(enq.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={enq.status}
                            onChange={(e) =>
                              handleStatusChange(enq.id, e.target.value as EnquiryStatus)
                            }
                            aria-label={`Status for ${displayName}`}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-hidden ${
                              isNew
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : isContacted
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                            }`}
                          >
                            <option value="new">{isTa ? "புதியது (New)" : "New"}</option>
                            <option value="contacted">{isTa ? "தொடர்புகொள்ளப்பட்டது" : "Contacted"}</option>
                            <option value="resolved">{isTa ? "தீர்க்கப்பட்டது" : "Resolved"}</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Call */}
                            <a
                              href={`tel:${cleanPhone}`}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                              title={isTa ? "வாடிக்கையாளரை அழைக்க" : "Call Customer"}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            {/* WhatsApp */}
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                isTa
                                  ? `வணக்கம் ${enq.customerName}, ${content.shopName} இல் நீங்கள் கேட்ட கோழிக்கறி விசாரணை தொடர்பாக:`
                                  : `Hello ${enq.customerName}, regarding your inquiry with ${content.shopName}:`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                              title={isTa ? "வாட்ஸ்அப்பில் உரையாட" : "Chat on WhatsApp"}
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 rounded" />
                            </a>

                            {/* View Modal */}
                            <button
                              type="button"
                              onClick={() => setSelectedEnquiry(enq)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-[#EDF7EE] hover:text-[#287A45] hover:border-[#C7E4CA] transition-colors"
                              title={isTa ? "முழு செய்தியைக் காண்க" : "View Message"}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(enq)}
                              className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                              title={isTa ? "விசாரணையை நீக்கு" : "Delete Enquiry"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedEnquiry(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs"
          />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EDF7EE] text-[#287A45] flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {!isTa
                      ? (selectedEnquiry.customerNameEn || ENQUIRY_TRANSLATIONS[selectedEnquiry.id]?.nameEn || ENQUIRY_TRANSLATIONS[selectedEnquiry.customerName]?.nameEn || selectedEnquiry.customerName)
                      : selectedEnquiry.customerName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedEnquiry.phoneNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {isTa ? "வாடிக்கையாளர் செய்தி:" : "Customer Message:"}
                </p>
                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {!isTa
                    ? (selectedEnquiry.messageEn || ENQUIRY_TRANSLATIONS[selectedEnquiry.id]?.messageEn || ENQUIRY_TRANSLATIONS[selectedEnquiry.customerName]?.messageEn || selectedEnquiry.message)
                    : selectedEnquiry.message}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {isTa ? "பெறப்பட்ட தேதி:" : "Received:"} {new Date(selectedEnquiry.submittedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{isTa ? "நிலை:" : "Status:"}</span>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedEnquiry.id,
                        e.target.value as EnquiryStatus
                      )
                    }
                    className="px-2 py-0.5 rounded-md border text-xs font-semibold"
                  >
                    <option value="new">{isTa ? "புதியது" : "New"}</option>
                    <option value="contacted">{isTa ? "தொடர்புகொள்ளப்பட்டது" : "Contacted"}</option>
                    <option value="resolved">{isTa ? "தீர்க்கப்பட்டது" : "Resolved"}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`https://wa.me/${selectedEnquiry.phoneNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold shadow-sm"
              >
                <WhatsAppIcon className="w-4 h-4 rounded" />
                <span>{isTa ? "வாட்ஸ்அப்பில் பதிலளி" : "Reply via WhatsApp"}</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {isTa ? "மூடு" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={isTa ? "விசாரணையை நீக்கவா?" : "Delete Enquiry?"}
        description={
          isTa
            ? `"${deleteTarget?.customerName}" அனுப்பிய விசாரணையை நிச்சயமாக நீக்க விரும்புகிறீர்களா?`
            : `Are you sure you want to delete the enquiry from "${deleteTarget?.customerName}"?`
        }
        confirmLabel={isTa ? "நீக்குவதை உறுதிசெய்" : "Confirm Delete"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
