import React, { useState } from 'react';
import {
  Lock,
  X,
  Users,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MessageCircle,
  Settings,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  School,
  LogOut,
  AlertCircle,
  Image as ImageIcon,
  Check,
  Crop,
} from 'lucide-react';
import mentorImg from '../assets/images/mentor_kak_syahdika.jpg';
import { PhotoCropModal } from './PhotoCropModal';
import { Applicant, AdminSettings } from '../types';
import {
  ADMIN_SECRET_CODE,
  updateApplicantStatusOnline,
  deleteApplicantOnline,
  saveSettingsOnline,
  exportApplicantsToCSV,
  resetApplicantsOnline,
} from '../services/storage';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  applicants: Applicant[];
  settings: AdminSettings;
  onDataChange: (updated: Applicant[]) => void;
  onSettingsChange: (updated: AdminSettings) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  applicants,
  settings,
  onDataChange,
  onSettingsChange,
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Applicant['status']>('all');

  // Detail Modal
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Settings Modal / Panel
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [waGroupUrlInput, setWaGroupUrlInput] = useState(settings.whatsappGroupUrl);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Photo Management Panel (Crop & Zoom Only)
  const [showPhotoPanel, setShowPhotoPanel] = useState(true);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [photoUploadSuccess, setPhotoUploadSuccess] = useState<string | null>(null);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);

  const handlePhotoSavedFromCrop = (newPhotoUrl: string) => {
    setPhotoUploadSuccess('✓ Hasil potongan & pembesaran foto Kak Syahdika berhasil disimpan permanen ke server!');
    onSettingsChange({
      ...settings,
      mentorPhotoUrl: newPhotoUrl,
      mentorPhotoUpdated: new Date().toISOString(),
    });
    setTimeout(() => setPhotoUploadSuccess(null), 5000);
  };

  const handleResetPhotoCrop = () => {
    if (window.confirm('Kembalikan posisi & potongan foto Kak Syahdika ke setelan normal default?')) {
      const defaultUrl = '/mentor_kak_syahdika.jpg?v=' + Date.now();
      onSettingsChange({
        ...settings,
        mentorPhotoUrl: defaultUrl,
        mentorPhotoUpdated: new Date().toISOString(),
      });
      setPhotoUploadSuccess('✓ Posisi & potongan foto Kak Syahdika telah direset ke default');
      setTimeout(() => setPhotoUploadSuccess(null), 3000);
    }
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_SECRET_CODE) {
      setIsAuthenticated(true);
      setAuthError(false);
      setPasswordInput('');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedApplicant(null);
    setShowSettingsPanel(false);
  };

  const handleStatusChange = async (id: string, newStatus: Applicant['status']) => {
    const updated = await updateApplicantStatusOnline(id, newStatus, adminNoteInput);
    onDataChange(updated);
    if (selectedApplicant && selectedApplicant.id === id) {
      setSelectedApplicant({ ...selectedApplicant, status: newStatus, adminNotes: adminNoteInput });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus pendaftar ini secara permanen dari database online?')) {
      const updated = await deleteApplicantOnline(id);
      onDataChange(updated);
      if (selectedApplicant?.id === id) {
        setSelectedApplicant(null);
      }
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminSettings = {
      ...settings,
      whatsappGroupUrl: waGroupUrlInput.trim(),
    };
    await saveSettingsOnline(updated);
    onSettingsChange(updated);
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 2000);
  };

  const handleResetData = async () => {
    if (window.confirm('Kembalikan data ke contoh simulasi awal di server?')) {
      const reset = await resetApplicantsOnline();
      onDataChange(reset);
      setSelectedApplicant(null);
    }
  };

  // Metrics
  const totalApplicants = applicants.length;
  const selectedCount = applicants.filter((a) => a.status === 'selected').length;
  const shortlistCount = applicants.filter((a) => a.status === 'shortlist').length;
  const pendingCount = applicants.filter((a) => a.status === 'pending').length;

  // Filtered applicants
  const filteredApplicants = applicants.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.campus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.whatsapp.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getWaChatUrl = (applicant: Applicant) => {
    let cleanPhone = applicant.whatsapp.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const message = encodeURIComponent(
      `Halo ${applicant.fullName}, saya Kak Syahdika (Lead Mentor GSA 2026).\nTerima kasih telah mendaftar seleksi bimbingan private GSA 2026 Batch 2 dari kampus ${applicant.campus}. Terkait formulir seleksimu, saya ingin mengonfirmasi kelengkapan data dan keikutsertaanmu di grup bimbingan.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-slate-900 text-slate-100 rounded-3xl shadow-2xl flex flex-col border border-slate-700 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                <span>Portal Seleksi Admin GSA 2026 Batch 2</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online & Realtime Sync</span>
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Pendaftaran dari seluruh perangkat langsung sinkron secara online ke database admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Password Form */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center my-auto">
            <div className="max-w-md w-full bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 mx-auto flex items-center justify-center mb-4 border border-blue-500/30">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Autentikasi Akun Admin</h4>
              <p className="text-xs text-slate-400 mb-6">
                Masukkan kode akses rahasia untuk membuka dashboard pendaftar & seleksi peserta.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    autoFocus
                    placeholder="Masukkan sandi admin..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setAuthError(false);
                    }}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-center text-sm tracking-widest text-white transition-all focus:outline-none focus:ring-2 ${
                      authError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-700 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {authError && (
                    <p className="text-xs text-red-400 mt-2 font-medium flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Sandi salah. Silakan coba lagi.</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30"
                >
                  Buka Dashboard Seleksi
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Top Stat Counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Pendaftar */}
              <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Total Pendaftar</span>
                  <span className="text-2xl font-bold text-white font-display tabular-nums">
                    {totalApplicants}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Kuota 50 Terpilih (Crucial highlight) */}
              <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-600/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-300 font-medium block">Lolos 50 Besar</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-emerald-400 font-display tabular-nums">
                      {selectedCount}
                    </span>
                    <span className="text-xs text-emerald-300/70 font-medium">/ 50 Kuota</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>

              {/* Cadangan / Shortlist */}
              <div className="bg-amber-950/30 p-4 rounded-2xl border border-amber-600/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-300 font-medium block">Cadangan / Shortlist</span>
                  <span className="text-2xl font-bold text-amber-400 font-display tabular-nums">
                    {shortlistCount}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              {/* Pending Review */}
              <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Menunggu Review</span>
                  <span className="text-2xl font-bold text-slate-200 font-display tabular-nums">
                    {pendingCount}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              {/* Search input */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama, kampus, jurusan, atau no WA..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {(['all', 'pending', 'selected', 'shortlist', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      statusFilter === st
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'all' && 'Semua'}
                    {st === 'pending' && `Pending (${pendingCount})`}
                    {st === 'selected' && `Lolos 50 (${selectedCount})`}
                    {st === 'shortlist' && `Cadangan (${shortlistCount})`}
                    {st === 'rejected' && 'Ditolak'}
                  </button>
                ))}
              </div>

              {/* Buttons: Export & WhatsApp Settings & Photo */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPhotoPanel(!showPhotoPanel)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                    showPhotoPanel
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-blue-300" />
                  <span>Foto Kak Syahdika</span>
                </button>

                <button
                  onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 font-medium transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-blue-400" />
                  <span>Link WA Grup</span>
                </button>

                <button
                  onClick={() => exportApplicantsToCSV(applicants)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs text-white font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handleResetData}
                  title="Muat ulang data simulasi"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Photo Management Card: Tanam Foto Permanen Kak Syahdika */}
            {showPhotoPanel && (
              <div className="bg-slate-800/90 p-5 sm:p-6 rounded-2xl border-2 border-blue-500/40 shadow-xl space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-400/30 text-blue-400 flex items-center justify-center">
                      <Crop className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span>Pengaturan Potong & Perbesar Foto Kak Syahdika</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                          Crop & Zoom Saja
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Foto resmi Kak Syahdika terpasang permanen. Anda dapat menyesuaikan tingkat perbesaran (zoom) dan menggeser posisi wajah agar pas di bingkai.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPhotoPanel(false)}
                    className="self-end sm:self-auto text-xs text-slate-400 hover:text-white"
                  >
                    Tutup
                  </button>
                </div>

                {photoUploadSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium">{photoUploadSuccess}</span>
                  </div>
                )}

                {photoUploadError && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="font-medium">{photoUploadError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Left: Active Photo Preview */}
                  <div className="md:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
                    <span className="text-xs font-semibold text-slate-300">Foto Kak Syahdika Aktif:</span>
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-blue-400/40 shadow-lg bg-blue-950 mx-auto sm:mx-0 select-none">
                      <img
                        src={settings.mentorPhotoUrl || mentorImg}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = '/mentor_kak_syahdika.jpg';
                        }}
                        alt="Kak Syahdika"
                        className="w-full h-full object-cover object-center pointer-events-none select-none"
                        draggable={false}
                      />
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/70 backdrop-blur-xs py-0.5 rounded text-[10px] text-center text-emerald-300 font-semibold border border-emerald-400/30">
                        Live di Website
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 leading-tight">
                      Kak Syahdika Kurnia Azhari <br />
                      <span className="text-blue-300 text-[10px]">Lead Mentor GSA 2026</span>
                    </span>
                  </div>

                  {/* Right: Crop & Zoom Only Controls */}
                  <div className="md:col-span-7 flex flex-col justify-center space-y-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-700/80">
                    <div>
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        <Crop className="w-4 h-4 text-amber-300" />
                        <span>Alat Penyesuaian Bingkai (Bukan Ganti Foto)</span>
                      </h5>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Foto tidak perlu di-upload ulang. Gunakan alat ini untuk <strong>memperbesar (zoom)</strong>, <strong>menggeser posisi wajah (pan)</strong>, dan <strong>memotong (crop)</strong> agar pas di tampilan website.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsCropModalOpen(true)}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Crop className="w-4 h-4 text-amber-300" />
                        <span>Perbesar & Potong Foto (Crop & Zoom)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetPhotoCrop}
                        className="py-3 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="Kembalikan posisi & potongan awal"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                        <span><strong>Zoom & Pan:</strong> Tarik foto dengan mouse/jari dan geser slider pembesaran.</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                        <span><strong>Presisi:</strong> Pilihan rasio 1:1 Persegi, 4:5 Portrait, dan Putar 90°.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WhatsApp Group Setting Accordion */}
            {showSettingsPanel && (
              <div className="bg-slate-800 p-5 rounded-2xl border border-blue-500/30 animate-in fade-in duration-150">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Pengaturan Link WhatsApp Group Bimbingan</span>
                  </h4>
                  {savedSettingsNotice && (
                    <span className="text-xs text-emerald-400 font-medium">Link berhasil disimpan!</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Setiap peserta yang menekan tombol kirim formulir akan diarahkan ke tautan grup ini. Kamu bisa mengganti tautan kapan saja jika grup sudah penuh (maksimal 1.024 member).
                </p>
                <form onSubmit={handleSaveSettings} className="flex gap-2">
                  <input
                    type="url"
                    value={waGroupUrlInput}
                    onChange={(e) => setWaGroupUrlInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://chat.whatsapp.com/..."
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan</span>
                  </button>
                </form>
              </div>
            )}

            {/* Table of Applicants */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3">Nama & Kontak</th>
                      <th className="px-4 py-3">Kampus & Jurusan</th>
                      <th className="px-4 py-3">1 Kalimat Gemini / AI</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredApplicants.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                          Tidak ada data pendaftar yang cocok dengan filter atau pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredApplicants.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/60 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-white">{item.fullName}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{item.whatsapp}</span>
                              <a
                                href={getWaChatUrl(item)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Chat WhatsApp"
                                className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-0.5"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>Chat</span>
                              </a>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-200">{item.campus}</div>
                            <div className="text-xs text-slate-400">
                              {item.major} · {item.semester}
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-xs">
                            <p className="text-xs text-slate-300 italic line-clamp-2">
                              "{item.geminiStatement}"
                            </p>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {item.status === 'selected' && (
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Lolos 50 Besar
                              </span>
                            )}
                            {item.status === 'shortlist' && (
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Cadangan
                              </span>
                            )}
                            {item.status === 'pending' && (
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300 border border-slate-600">
                                Pending
                              </span>
                            )}
                            {item.status === 'rejected' && (
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                                Ditolak
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                            <button
                              onClick={() => {
                                setSelectedApplicant(item);
                                setAdminNoteInput(item.adminNotes || '');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-medium transition-colors inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Detail</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Applicant Detailed Inspection Modal */}
            {selectedApplicant && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
                  <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-bold text-white">
                          {selectedApplicant.fullName}
                        </h4>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                          {selectedApplicant.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {selectedApplicant.campus} · {selectedApplicant.major} ({selectedApplicant.semester})
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedApplicant(null)}
                      className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Contact Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{selectedApplicant.whatsapp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="truncate">{selectedApplicant.email}</span>
                    </div>
                    {selectedApplicant.portfolioLink && (
                      <div className="col-span-2 pt-1 border-t border-slate-700 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0" />
                        <a
                          href={selectedApplicant.portfolioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline truncate"
                        >
                          {selectedApplicant.portfolioLink}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Essay Questions */}
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                      <h5 className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-1.5">
                        Visi & Misi di Google Student Ambassador:
                      </h5>
                      <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {selectedApplicant.visionMission}
                      </p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                      <h5 className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-1.5">
                        Motivasi Mengikuti Bimbingan Bersama Kak Dika:
                      </h5>
                      <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {selectedApplicant.motivation}
                      </p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                      <h5 className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-1.5">
                        Satu Kalimat tentang Google Gemini / Google AI:
                      </h5>
                      <p className="text-slate-200 italic leading-relaxed">
                        "{selectedApplicant.geminiStatement}"
                      </p>
                    </div>
                  </div>

                  {/* Admin Note Section */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Catatan Kurasi Kak Dika (Internal):
                    </label>
                    <textarea
                      rows={2}
                      value={adminNoteInput}
                      onChange={(e) => setAdminNoteInput(e.target.value)}
                      placeholder="Tulis catatan evaluasi kandidat..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Action Selection Buttons */}
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleStatusChange(selectedApplicant.id, 'selected')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            selectedApplicant.status === 'selected'
                              ? 'bg-emerald-500 text-slate-950 shadow-lg'
                              : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60'
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Loloskan ke 50 Besar</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(selectedApplicant.id, 'shortlist')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            selectedApplicant.status === 'shortlist'
                              ? 'bg-amber-400 text-slate-950 shadow-lg'
                              : 'bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-700/60'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Jadikan Cadangan</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(selectedApplicant.id, 'rejected')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            selectedApplicant.status === 'rejected'
                              ? 'bg-red-500 text-white shadow-lg'
                              : 'bg-red-950/50 hover:bg-red-900 text-red-300 border border-red-700/60'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </button>
                      </div>

                      <a
                        href={getWaChatUrl(selectedApplicant)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp Personal</span>
                      </a>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={() => handleDelete(selectedApplicant.id)}
                        className="text-xs text-red-400 hover:text-red-300 underline"
                      >
                        Hapus Pendaftar Ini
                      </button>
                      <button
                        onClick={() => setSelectedApplicant(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold"
                      >
                        Selesai Meninjau
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Photo Crop & Zoom Modal */}
      <PhotoCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        currentPhotoUrl={settings.mentorPhotoUrl || mentorImg}
        onPhotoSaved={handlePhotoSavedFromCrop}
      />
    </div>
  );
};
