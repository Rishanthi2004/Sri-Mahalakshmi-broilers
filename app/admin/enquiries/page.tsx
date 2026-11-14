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
import { enquiryService } from "@/services/media-enquiry-service";
import { useWebsiteContent } from "@/services/use-store-data";
import { Enquiry, EnquiryStatus } from "@/types";

export default function AdminEnquiriesPage() {
  const { content } = useWebsiteContent();
  const { showToast } = useToast();

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
      showToast("விசாரணை நிலை மாற்றப்பட்டது", {
        description: nextStatus === "new" ? "புதியது" : nextStatus === "contacted" ? "தொடர்புகொள்ளப்பட்டது" : "தீர்க்கப்பட்டது",
      });
    } catch {
      showToast("நிலையை மாற்றுவதில் பிழை", { type: "danger" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      enquiryService.remove(deleteTarget.id);
      setEnquiries(enquiryService.getAll());
      showToast("விசாரணை நீக்கப்பட்டது", { type: "info" });
    } catch {
      showToast("விசாரணையை நீக்குவதில் பிழை", { type: "danger" });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <AdminShell
      title="வாடிக்கையாளர் விசாரணைகள்"
      subtitle="தொடர்பு பக்கம் வழியாக வாடிக்கையாளர்கள் அனுப்பிய கோரிக்கைகள் மற்றும் விசாரணைகளை நிர்வகித்தல்"
      actions={
        <button
          type="button"
          onClick={loadEnquiries}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#287A45] ${loading ? "animate-spin" : ""}`} />
          <span>விசாரணைகளைப் புதுப்பி</span>
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
                  ? "அனைத்தும்"
                  : status === "new"
                  ? "புதியது"
                  : status === "contacted"
                  ? "தொடர்புகொள்ளப்பட்டது"
                  : "தீர்க்கப்பட்டது";

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
              placeholder="பெயர் அல்லது அலைபேசி எண்..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#287A45]"
            />
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquareText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">விசாரணைகள் எதுவும் கிடைக்கவில்லை</p>
              <p className="text-xs text-slate-500 mt-1">வாடிக்கையாளர்கள் இணையதளம் வழியாக அனுப்பும் செய்திகள் இங்கு தோன்றும்.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">வாடிக்கையாளர்</th>
                    <th className="py-3 px-4">அலைபேசி எண்</th>
                    <th className="py-3 px-4">செய்தி முன்னோட்டம்</th>
                    <th className="py-3 px-4">தேதி</th>
                    <th className="py-3 px-4">நிலை</th>
                    <th className="py-3 px-4 text-right">விரைவுத் தொடர்பு &amp; செயல்கள்</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((enq) => {
                    const cleanPhone = enq.phoneNumber.replace(/[^0-9]/g, "");
                    const isNew = enq.status === "new";
                    const isContacted = enq.status === "contacted";

                    return (
                      <tr key={enq.id} className="hover:bg-[#EDF7EE]/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {enq.customerName}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                          {enq.phoneNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-xs text-slate-600 line-clamp-1 max-w-xs">{enq.message}</p>
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
                            aria-label={`Status for ${enq.customerName}`}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-hidden ${
                              isNew
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : isContacted
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                            }`}
                          >
                            <option value="new">புதியது (New)</option>
                            <option value="contacted">தொடர்புகொள்ளப்பட்டது</option>
                            <option value="resolved">தீர்க்கப்பட்டது</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Call */}
                            <a
                              href={`tel:${cleanPhone}`}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                              title="வாடிக்கையாளரை அழைக்க"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            {/* WhatsApp */}
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                `வணக்கம் ${enq.customerName}, ${content.shopName} இல் நீங்கள் கேட்ட கோழிக்கறி விசாரணை தொடர்பாக:`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                              title="வாட்ஸ்அப்பில் உரையாட"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 rounded" />
                            </a>

                            {/* View Modal */}
                            <button
                              type="button"
                              onClick={() => setSelectedEnquiry(enq)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-[#EDF7EE] hover:text-[#287A45] hover:border-[#C7E4CA] transition-colors"
                              title="முழு செய்தியைக் காண்க"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(enq)}
                              className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                              title="விசாரணையை நீக்கு"
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
                    {selectedEnquiry.customerName}
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
                  வாடிக்கையாளர் செய்தி:
                </p>
                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {selectedEnquiry.message}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>பெறப்பட்ட தேதி: {new Date(selectedEnquiry.submittedAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>நிலை:</span>
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
                    <option value="new">புதியது</option>
                    <option value="contacted">தொடர்புகொள்ளப்பட்டது</option>
                    <option value="resolved">தீர்க்கப்பட்டது</option>
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
                <span>வாட்ஸ்அப்பில் பதிலளி</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                மூடு
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="விசாரணையை நீக்கவா?"
        description={`"${deleteTarget?.customerName}" அனுப்பிய விசாரணையை நிச்சயமாக நீக்க விரும்புகிறீர்களா?`}
        confirmLabel="நீக்குவதை உறுதிசெய்"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
