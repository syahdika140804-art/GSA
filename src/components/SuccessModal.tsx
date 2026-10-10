import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Copy, Check, ExternalLink, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { Applicant } from '../types';

interface SuccessModalProps {
  applicant: Applicant | null;
  whatsappGroupUrl: string;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  applicant,
  whatsappGroupUrl,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!applicant) return null;

  const targetWaUrl = whatsappGroupUrl || 'https://chat.whatsapp.com/F52YcJInyIW2XNxwSJkW2U?mode=gi_t';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetWaUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white text-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-white/50 animate-in zoom-in-95 duration-300">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#1a73e8] via-[#1557b0] to-[#0d47a1] p-6 sm:p-8 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/30 backdrop-blur-md text-amber-300 mx-auto flex items-center justify-center mb-3 shadow-inner">
            <Sparkles className="w-9 h-9" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white mb-1">
            Formulir Berhasil Terkirim!
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 font-medium">
            Pendaftaran Seleksi Bimbingan Eksklusif GSA 2026 Batch 2
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Greeting Box */}
          <div className="bg-blue-50/90 rounded-2xl p-4 border border-blue-200 flex items-start gap-3.5">
            <CheckCircle2 className="w-6 h-6 text-[#1a73e8] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Selamat, {applicant.fullName}!
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                <span className="font-semibold text-blue-700">Pendaftaran kamu sudah masuk ke akun admin!</span> Data dari{' '}
                <strong>{applicant.campus}</strong> ({applicant.major}) telah tersimpan secara online dan realtime.
              </p>
            </div>
          </div>

          {/* Critical Next Step Banner with user requested message */}
          <div className="bg-emerald-50 rounded-2xl p-5 sm:p-6 border-2 border-emerald-300 text-center space-y-3.5 shadow-sm">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Konfirmasi & Akses Grup Resmi</span>
            </div>

            {/* Exact wording from user prompt */}
            <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs">
              <p className="text-sm sm:text-base font-bold text-emerald-950 leading-relaxed">
                Pendaftaran kamu sudah masuk ke akun admin, silahkan masuk ke grup :{' '}
                <a
                  href={targetWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-900 underline font-mono break-all inline-block mt-1 sm:mt-0"
                >
                  {targetWaUrl}
                </a>{' '}
                , untuk informasi kelulusan program bimbingan
              </p>
            </div>

            <p className="text-xs text-slate-600">
              Klik tombol hijau di bawah ini untuk langsung terhubung ke grup WhatsApp calon bimbingan Kak Syahdika:
            </p>

            {/* THE BIG WHATSAPP BUTTON */}
            <a
              href={targetWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-base sm:text-lg shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-100 cursor-pointer"
            >
              <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
              <span>Masuk ke Grup WhatsApp Bimbingan</span>
              <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
            </a>

            {/* Direct Link Display & Copy Button */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-600">
              <span className="truncate max-w-xs text-slate-500 font-mono text-[11px] bg-slate-100 px-2 py-1 rounded">
                {targetWaUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
              </button>
            </div>
          </div>

          {/* Guidelines inside Group */}
          <div className="text-xs text-slate-500 space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-700 block">Penting:</span>
            <p>1. Di dalam grup, seluruh pengumuman kurasi dan hasil seleksi 50 peserta terpilih akan dirilis.</p>
            <p>2. Pastikan nomor WhatsApp yang kamu daftarkan aktif untuk verifikasi langsung oleh tim Kak Syahdika.</p>
          </div>

          {/* Close Action */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Tutup & Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
