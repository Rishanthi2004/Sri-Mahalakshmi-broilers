"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Edit2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserX,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/common/ToastProvider";
import { useLanguage } from "@/context/LanguageContext";
import { USER_NAME_TRANSLATIONS } from "@/data/enquiries";
import { userService } from "@/services/user-service";
import { AdminUser } from "@/types";

interface UserFormState {
  name: string;
  email: string;
  role: "super_admin" | "staff_admin";
  password: string;
  isActive: boolean;
}

const EMPTY_FORM: UserFormState = {
  name: "",
  email: "",
  role: "staff_admin",
  password: "",
  isActive: true,
};

const INITIAL_USERS: AdminUser[] = [
  {
    id: "user-superadmin",
    name: "ராஜேஷ் நாயர் (உரிமையாளர்)",
    email: "admin@greenpasture.com",
    role: "super_admin",
    isActive: true,
  },
  {
    id: "user-demo-admin",
    name: "கடை நிர்வாகி (Admin)",
    email: "admin@greenpasture.demo",
    role: "super_admin",
    isActive: true,
  },
  {
    id: "user-staff",
    name: "பூஜா சர்மா (பணியாளர்)",
    email: "staff@greenpasture.com",
    role: "staff_admin",
    isActive: true,
  },
];

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isTa = language === "ta";

  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const loadUsers = useCallback(() => {
    setLoading(true);
    try {
      setUsers(userService.getAll());
    } catch (e) {
      console.error("Failed to load users", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openNew = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditingUser(u);
    setForm({
      name: u.name,
      email: u.email,
      role: (u.role as "super_admin" | "staff_admin") || "staff_admin",
      password: "",
      isActive: u.isActive ?? true,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.email.trim()) {
      setFormError(isTa ? "பெயர் மற்றும் மின்னஞ்சல் முகவரி கட்டாயமாகும்." : "Name and email address are required.");
      return;
    }

    if (!editingUser && (!form.password || form.password.length < 6)) {
      setFormError(
        isTa
          ? "புதிய பயனருக்கு கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்."
          : "Password must be at least 6 characters for a new user."
      );
      return;
    }

    if (editingUser && form.password && form.password.length < 6) {
      setFormError(
        isTa
          ? "புதிய கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்."
          : "New password must be at least 6 characters."
      );
      return;
    }

    setSubmitting(true);

    try {
      if (editingUser) {
        userService.update(editingUser.id, {
          name: form.name.trim(),
          role: form.role,
          isActive: form.isActive,
        });
        showToast(
          isTa
            ? "நிர்வாகப் பயனர் விவரங்கள் புதுப்பிக்கப்பட்டன"
            : "Admin user updated successfully",
          { description: form.name }
        );
      } else {
        userService.create({
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          isActive: form.isActive,
        });
        showToast(
          isTa
            ? "புதிய நிர்வாகப் பயனர் சேர்க்கப்பட்டார்"
            : "New admin user added successfully",
          { description: form.name }
        );
      }

      setModalOpen(false);
      loadUsers();
    } catch (err: unknown) {
      setFormError((err as Error).message || (isTa ? "பிழை ஏற்பட்டது." : "An error occurred."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      userService.remove(deleteTarget.id);
      showToast(
        isTa ? "நிர்வாகப் பயனர் நீக்கப்பட்டார்" : "Admin user deleted",
        { description: deleteTarget.name, type: "info" }
      );
      loadUsers();
    } catch {
      showToast(isTa ? "பயனரை நீக்குவதில் பிழை" : "Failed to delete user", { type: "danger" });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <AdminShell
      title={isTa ? "நிர்வாகப் பயனர்கள் மேலாண்மை" : "Admin Users Management"}
      subtitle={
        isTa
          ? "பொறுப்பு அடிப்படையிலான அணுகல் கட்டுப்பாடு, நற்சான்றிதழ்கள் மேலாண்மை மற்றும் குழு கணக்கு அனுமதிகள்"
          : "Role-based access control, credential management, and team account permissions"
      }
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadUsers}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs"
            title={isTa ? "பயனர்களைப் புதுப்பி" : "Refresh Users"}
          >
            <RefreshCw className={`w-4 h-4 text-[#287A45] ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#287A45]/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{isTa ? "புதிய நிர்வாகியைச் சேர்" : "Add New Admin"}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Role Explanation Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDF7EE] border border-[#C7E4CA] text-[#287A45] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isTa ? "பொறுப்பு அடிப்படையிலான அணுகல் படிநிலை" : "Role-Based Access Hierarchy"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {isTa ? (
                  <>
                    <strong>முதன்மை நிர்வாகி (Super Admin):</strong> பயனர் மேலாண்மை, அமைப்புகள் மற்றும் முழுமையான அணுகல். <br />
                    <strong>பணியாளர் நிர்வாகி (Staff Admin):</strong> அன்றாட செயல்பாடுகள் (பொருட்கள், பிரிவுகள், ஆர்டர்கள், விசாரணைகள்).
                  </>
                ) : (
                  <>
                    <strong>Super Admin:</strong> Full unrestricted access including user management and system settings. <br />
                    <strong>Staff Admin:</strong> Daily catalog operations (products, categories, banners, and enquiries).
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="font-mono text-xs text-slate-600 bg-[#EDF7EE] px-3.5 py-1.5 rounded-xl border border-[#C7E4CA]">
            {isTa ? "மொத்தக் கணக்குகள்:" : "Total Accounts:"} <strong className="text-[#287A45]">{users.length}</strong>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">{isTa ? "நிர்வாகி பெயர்" : "Admin Name"}</th>
                  <th className="py-3 px-4">{isTa ? "மின்னஞ்சல்" : "Email"}</th>
                  <th className="py-3 px-4">{isTa ? "பொறுப்பு" : "Role"}</th>
                  <th className="py-3 px-4">{isTa ? "கணக்கு நிலை" : "Account Status"}</th>
                  <th className="py-3 px-4">{isTa ? "கடைசி உள்நுழைவு" : "Last Login"}</th>
                  <th className="py-3 px-4 text-right">{isTa ? "செயல்கள்" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-5 h-5 text-[#287A45] animate-spin" />
                        <span>{isTa ? "பயனர் விவரங்கள் ஏற்றப்படுகின்றன..." : "Loading user accounts..."}</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-slate-500">
                      {isTa ? "நிர்வாகப் பயனர்கள் விவரங்கள் எதுவும் கிடைக்கவில்லை." : "No admin user accounts found."}
                    </td>
                  </tr>
                ) : (
                    users.map((u) => {
                      const isSuper = u.role === "super_admin";
                      const displayUserName = !isTa
                        ? (USER_NAME_TRANSLATIONS[u.id] || USER_NAME_TRANSLATIONS[u.name] || u.name || "Unnamed User")
                        : (u.name || "பெயரிடப்படாத பயனர்");
                      const userInitials = displayUserName.slice(0, 2).toUpperCase();

                      return (
                        <tr key={u.id} className="hover:bg-[#EDF7EE]/30 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#EDF7EE] border border-[#C7E4CA] flex items-center justify-center font-bold text-[#287A45] text-xs">
                                {userInitials}
                              </div>
                              <span>{displayUserName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                            {u.email}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isSuper
                                  ? "bg-[#EDF7EE] text-[#287A45] border border-[#C7E4CA]"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              <ShieldCheck className="w-3 h-3 text-[#287A45]" />
                              {isSuper ? (isTa ? "முதன்மை நிர்வாகி" : "Super Admin") : (isTa ? "பணியாளர் நிர்வாகி" : "Staff Admin")}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-semibold ${
                                u.isActive
                                  ? "text-emerald-700"
                                  : "text-slate-400"
                              }`}
                            >
                              {u.isActive ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>{isTa ? "செயலில் உள்ளது" : "Active"}</span>
                                </>
                              ) : (
                                <>
                                  <UserX className="w-3.5 h-3.5" />
                                  <span>{isTa ? "முடக்கப்பட்டது" : "Disabled"}</span>
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                            {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString(isTa ? "ta-IN" : "en-US") : (isTa ? "இதுவரை உள்நுழையவில்லை" : "Never logged in")}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEdit(u)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-[#EDF7EE] hover:text-[#287A45] hover:border-[#C7E4CA] transition-colors"
                                title={isTa ? "பயனரைத் திருத்து" : "Edit User"}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(u)}
                                className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                                title={isTa ? "பயனரை நீக்கு" : "Delete User"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs"
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingUser ? (isTa ? "நிர்வாகப் பயனரைத் திருத்து" : "Edit Admin User") : (isTa ? "புதிய நிர்வாகியை உருவாக்கு" : "Create New Admin")}
                </h2>
                <p className="text-xs text-slate-500">
                  {isTa ? "கணக்கு பெயர், அனுமதிகள் மற்றும் பாதுகாப்பு நற்சான்றிதழ்களை அமைக்கவும்." : "Configure account name, permissions, and security credentials."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "முழுப் பெயர் *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={isTa ? "எ.கா. ராஜேஷ் நாயர்" : "e.g. Rajesh Nair"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "மின்னஞ்சல் முகவரி *" : "Email Address *"}
                </label>
                <input
                  type="email"
                  required
                  disabled={Boolean(editingUser)}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@greenpasture.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:bg-slate-100 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isTa ? "பொறுப்பு" : "Role"}
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value as "super_admin" | "staff_admin",
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                >
                  <option value="staff_admin">{isTa ? "பணியாளர் நிர்வாகி (பொருட்கள் & விசாரணைகள்)" : "Staff Admin (Products & Enquiries)"}</option>
                  <option value="super_admin">{isTa ? "முதன்மை நிர்வாகி (முழு அணுகல் & அமைப்புகள்)" : "Super Admin (Full Access & Settings)"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {editingUser ? (isTa ? "கடவுச்சொல் மாற்று (மாற்ற வேண்டாமெனில் காலியாக விடவும்)" : "Change Password (leave blank to keep current)") : (isTa ? "கடவுச்சொல் *" : "Password *")}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editingUser ? (isTa ? "மாற்ற புதிய கடவுச்சொல்லை உள்ளிடவும்..." : "Enter new password to change...") : (isTa ? "குறைந்தது 6 எழுத்துகள்" : "At least 6 characters")}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-[#287A45] focus:outline-hidden"
                />
              </div>

              {editingUser && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="user-active-toggle"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#287A45] focus:ring-[#287A45] border-slate-300"
                  />
                  <label htmlFor="user-active-toggle" className="text-xs font-bold text-slate-700">
                    {isTa ? "கணக்கு செயலில் உள்ளது மற்றும் உள்நுழைய அனுமதிக்கப்படுகிறது" : "Account is active and permitted to sign in"}
                  </label>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {isTa ? "ரத்து செய்" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] disabled:opacity-60 text-white text-xs font-semibold shadow-md shadow-[#287A45]/20"
                >
                  {submitting ? (isTa ? "சேமிக்கப்படுகிறது..." : "Saving...") : editingUser ? (isTa ? "பயனரைப் புதுப்பி" : "Update User") : (isTa ? "பயனரை உருவாக்கு" : "Create User")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={isTa ? "நிர்வாகக் கணக்கை நீக்கவா?" : "Delete Admin Account?"}
        description={isTa ? `${deleteTarget?.name} (${deleteTarget?.email}) கணக்கை நிச்சயமாக நீக்க விரும்புகிறீர்களா? அவர்கள் நிர்வாகக் கட்டுப்பாட்டு அறைக்கான அணுகலை உடனடியாக இழப்பார்கள்.` : `Are you sure you want to delete ${deleteTarget?.name} (${deleteTarget?.email})? They will immediately lose access to the admin dashboard.`}
        confirmLabel={isTa ? "கணக்கை நீக்கு" : "Delete Account"}
        cancelLabel={isTa ? "ரத்து செய்" : "Cancel"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
