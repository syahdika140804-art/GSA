import React from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onScrollToForm: () => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onScrollToForm, isAdminLoggedIn }) => {
  return (
    <header className="fixed top-4 left-0 right-0 z-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md text-slate-800 rounded-full shadow-xl shadow-blue-950/20 px-5 sm:px-8 py-3.5 flex items-center justify-between border border-white/60 transition-all">
        {/* Left: Google Student Ambassador Logo */}
        <a href="#" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white border border-slate-200/80 shadow-xs p-1.5 transition-transform group-hover:scale-105">
            <img
              src="/src/assets/images/google_logo.svg"
              alt="Google Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Google Student Ambassador
            </span>
          </div>
        </a>

        {/* Center: Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-slate-600">
          <a href="#track-record" className="hover:text-blue-600 transition-colors whitespace-nowrap">
            Prestasi & Bukti
          </a>
          <a href="#keuntungan" className="hover:text-blue-600 transition-colors whitespace-nowrap">
            Keuntungan
          </a>
          <a href="#prasyarat" className="hover:text-blue-600 transition-colors whitespace-nowrap">
            Prasyarat
          </a>
          <a href="#timeline" className="hover:text-blue-600 transition-colors whitespace-nowrap">
            Timeline
          </a>
          <a href="#faq" className="hover:text-blue-600 transition-colors whitespace-nowrap">
            FAQ
          </a>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Subtle Admin Button */}
          <button
            onClick={onOpenAdmin}
            title={isAdminLoggedIn ? "Admin Dashboard (Login Terbuka)" : "Portal Admin Bimbingan (Khusus Kak Dika)"}
            className={`p-2 rounded-full transition-colors ${
              isAdminLoggedIn
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isAdminLoggedIn ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </button>

          {/* Primary CTA */}
          <button
            onClick={onScrollToForm}
            className="flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full shadow-md shadow-blue-500/25 transition-all hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Daftar Seleksi</span>
            <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
          </button>
        </div>
      </div>
    </header>
  );
};
