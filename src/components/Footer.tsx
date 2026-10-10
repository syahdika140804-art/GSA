import React from 'react';
import { Lock, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#061d4a] text-slate-300 py-12 border-t border-white/10 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white p-1.5 shadow-sm flex items-center justify-center shrink-0">
              <img
                src="/src/assets/images/google_logo.svg"
                alt="Google Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight block">
                Google Student Ambassador 2026 Batch 2
              </span>
              <span className="text-xs text-slate-400">
                Seleksi Bimbingan Eksklusif 50 Mahasiswa bersama Kak Syahdika
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#track-record" className="hover:text-white transition-colors">
              Track Record
            </a>
            <a href="#keuntungan" className="hover:text-white transition-colors">
              Keuntungan
            </a>
            <a href="#prasyarat" className="hover:text-white transition-colors">
              Prasyarat
            </a>
            <a href="#timeline" className="hover:text-white transition-colors">
              Timeline
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Access</span>
            </button>

            <button
              onClick={scrollToTop}
              title="Kembali ke atas"
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left">
          <p>
            &copy; 2026 Inisiatif Mentoring Komunitas Google Student Ambassador Indonesia. Dipandu oleh Kak Syahdika (Lead Mentor GSA).
          </p>
          <p className="flex items-center gap-1">
            <span>Lead, Innovate, Inspire with Google AI</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
