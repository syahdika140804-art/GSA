import React, { useState } from 'react';
import { Send, Sparkles, User, School, BookOpen, Phone, Mail, Award, CheckCircle, Lightbulb, Compass, Link2 } from 'lucide-react';
import { Applicant } from '../types';
import { saveApplicantOnline } from '../services/storage';

interface RegistrationFormProps {
  onSuccess: (applicant: Applicant) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    email: '',
    campus: '',
    major: '',
    semester: 'Semester 3',
    visionMission: '',
    motivation: '',
    geminiStatement: '',
    portfolioLink: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi untuk verifikasi grup';
    } else if (formData.whatsapp.trim().length < 9) {
      newErrors.whatsapp = 'Format nomor WhatsApp tidak valid (minimal 9 digit)';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email aktif wajib diisi';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.campus.trim()) newErrors.campus = 'Nama kampus / universitas wajib diisi';
    if (!formData.major.trim()) newErrors.major = 'Jurusan / Program studi wajib diisi';
    if (!formData.visionMission.trim()) {
      newErrors.visionMission = 'Visi & Misi di GSA wajib diisi (minimal 20 karakter)';
    } else if (formData.visionMission.trim().length < 20) {
      newErrors.visionMission = 'Jelaskan visi misi kamu lebih mendalam (minimal 20 karakter)';
    }
    if (!formData.motivation.trim()) {
      newErrors.motivation = 'Motivasi mengikuti bimbingan wajib diisi (minimal 20 karakter)';
    } else if (formData.motivation.trim().length < 20) {
      newErrors.motivation = 'Jelaskan motivasi kamu lebih mendalam (minimal 20 karakter)';
    }
    if (!formData.geminiStatement.trim()) {
      newErrors.geminiStatement = 'Tuliskan 1 kalimat pandanganmu tentang Google Gemini / Google AI';
    } else if (formData.geminiStatement.trim().length < 10) {
      newErrors.geminiStatement = 'Tuliskan kalimat yang lebih bermakna (minimal 10 karakter)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await saveApplicantOnline({
        fullName: formData.fullName.trim(),
        whatsapp: formData.whatsapp.trim(),
        email: formData.email.trim(),
        campus: formData.campus.trim(),
        major: formData.major.trim(),
        semester: formData.semester,
        visionMission: formData.visionMission.trim(),
        motivation: formData.motivation.trim(),
        geminiStatement: formData.geminiStatement.trim(),
        portfolioLink: formData.portfolioLink.trim() || undefined,
      });

      setIsSubmitting(false);
      onSuccess(created);
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <section id="daftar" className="py-20 bg-gradient-to-b from-[#0b388f] via-[#0d44ad] to-[#0a2f7c] relative border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold mb-4 shadow-sm">
            <img src="/src/assets/images/google_logo.svg" alt="Google" className="w-4 h-4 object-contain" />
            <span>Formulir Pendaftaran Resmi · Kuota 50 Kursi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display">
            Seleksi Bimbingan Eksklusif <br />
            <span className="text-amber-300">GSA 2026 Batch 2</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Isi data diri dan esai singkat di bawah ini dengan sungguh-sungguh. Setelah submit formulir, kamu akan langsung mendapatkan akses <strong>Tombol Masuk Grup WhatsApp Bimbingan</strong>.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-xl text-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/40">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Identity Section */}
            <div className="border-b border-slate-200 pb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>1. Data Diri & Kontak</span>
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Pastikan nomor WhatsApp dan email aktif untuk konfirmasi grup bimbingan.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="fullName"
                      type="text"
                      placeholder="Contoh: Syahdika Kurnia"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.fullName
                          ? 'border-red-400 focus:ring-red-300 bg-red-50/50'
                          : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50'
                      }`}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-600 mt-1 font-medium">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp (Aktif) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="whatsapp"
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.whatsapp
                          ? 'border-red-400 focus:ring-red-300 bg-red-50/50'
                          : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50'
                      }`}
                    />
                  </div>
                  {errors.whatsapp && <p className="text-xs text-red-600 mt-1 font-medium">{errors.whatsapp}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Mahasiswa / Aktif <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="Contoh: nama.kamu@students.univ.ac.id"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-red-400 focus:ring-red-300 bg-red-50/50'
                          : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-600 mt-1 font-medium">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="border-b border-slate-200 pb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <School className="w-5 h-5 text-blue-600" />
                <span>2. Asal Kampus & Program Studi</span>
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Semua universitas, institut, dan politeknik se-Indonesia berhak mendaftar.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Kampus / Universitas <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="campus"
                    type="text"
                    placeholder="Contoh: Politeknik Negeri Medan / Universitas Indonesia / ITB"
                    value={formData.campus}
                    onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.campus
                        ? 'border-red-400 focus:ring-red-300 bg-red-50/50'
                        : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50'
                    }`}
                  />
                  {errors.campus && <p className="text-xs text-red-600 mt-1 font-medium">{errors.campus}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Semester Saat Ini
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8+">Semester 8+</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Jurusan / Program Studi <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="major"
                    type="text"
                    placeholder="Contoh: Teknik Komputer / Sistem Informasi / Ilmu Komunikasi / Manajemen"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.major
                        ? 'border-red-400 focus:ring-red-300 bg-red-50/50'
                        : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50'
                    }`}
                  />
                  {errors.major && <p className="text-xs text-red-600 mt-1 font-medium">{errors.major}</p>}
                </div>
              </div>
            </div>

            {/* Core Essays Required by Prompt */}
            <div className="space-y-6 pt-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <span>3. Pertanyaan Seleksi & Esai Singkat</span>
              </h3>

              {/* Visi Misi di GSA */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Visi & Misi Kamu di Google Student Ambassador (GSA) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="visionMission"
                  rows={3}
                  placeholder="Ceritakan apa yang ingin kamu capai di kampusmu jika terpilih sebagai GSA dan bagaimana kamu akan membawa inovasi teknologi Google..."
                  value={formData.visionMission}
                  onChange={(e) => setFormData({ ...formData, visionMission: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.visionMission
                      ? 'border-red-400 focus:ring-red-300 bg-red-50/50'
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50'
                  }`}
                />
                {errors.visionMission && <p className="text-xs text-red-600 mt-1 font-medium">{errors.visionMission}</p>}
              </div>

              {/* Motivasi Mengikuti Bimbingan Bersama Kak Dika */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Apa Motivasi Mengikuti Bimbingan Bersama Kak Dika? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="motivation"
                  rows={3}
                  placeholder="Jelaskan alasanmu ingin dibimbing langsung oleh Kak Dika (mentor 7 dari Top 10 Trailblazer Batch 1 & Bintang Video Dokumenter Google) dan seberapa besar komitmenmu..."
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.motivation
                      ? 'border-red-400 focus:ring-red-300 bg-red-50/50'
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50'
                  }`}
                />
                {errors.motivation && <p className="text-xs text-red-600 mt-1 font-medium">{errors.motivation}</p>}
              </div>

              {/* Satu Kalimat tentang Google Gemini / Google AI */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Kasih Satu Kalimat tentang Google Gemini / Google AI <span className="text-red-500">*</span></span>
                  <span className="text-[11px] text-blue-600 font-normal">1 Kalimat berbobot</span>
                </label>
                <input
                  id="geminiStatement"
                  type="text"
                  placeholder="Contoh: Google Gemini adalah revolusi kecerdasan buatan yang memberdayakan mahasiswa berinovasi tanpa batas teknis."
                  value={formData.geminiStatement}
                  onChange={(e) => setFormData({ ...formData, geminiStatement: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.geminiStatement
                      ? 'border-red-400 focus:ring-red-300 bg-red-50/50'
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50'
                  }`}
                />
                {errors.geminiStatement && <p className="text-xs text-red-600 mt-1 font-medium">{errors.geminiStatement}</p>}
              </div>

              {/* Link LinkedIn / Portfolio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Link LinkedIn / Portofolio / Instagram (Opsional)</span>
                  <span className="text-[11px] text-slate-400 font-normal">Nilai tambah seleksi</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="Contoh: https://linkedin.com/in/username atau https://instagram.com/username"
                    value={formData.portfolioLink}
                    onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submission Notice & Submit Button */}
            <div className="pt-6 border-t border-slate-200">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-start gap-3 mb-6 text-xs text-blue-900">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Setelah Menekan Tombol Kirim Formulir dan Buka Akses:</span>
                  Datamu akan langsung masuk ke akun admin secara online dan realtime, dan layar akan memunculkan akses ke grup WhatsApp resmi bimbingan.
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#1a73e8] to-[#1557b0] hover:from-[#1557b0] hover:to-[#0d47a1] text-white font-bold text-base sm:text-lg shadow-xl shadow-blue-500/25 transition-all hover:shadow-2xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan & Mengirim ke Akun Admin...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Kirim Formulir dan Buka Akses</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
