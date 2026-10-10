import React from 'react';
import { ArrowDown, Award, Sparkles, Users, Trophy, Video } from 'lucide-react';
import mentorImg from '../assets/images/mentor_kak_syahdika.jpg';

interface HeroProps {
  onScrollToForm: () => void;
  onScrollToTrackRecord: () => void;
  mentorPhotoUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToForm,
  onScrollToTrackRecord,
  mentorPhotoUrl,
}) => {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Background radial gradients for vibrant ambient lighting matching the screenshot */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] bg-blue-500/25 blur-[120px] rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-cyan-400/20 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-indigo-500/25 blur-[110px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtle pill tag indicating GSA selection */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-xs sm:text-sm font-medium mb-8 shadow-xs">
          <img src="/src/assets/images/google_logo.svg" alt="Google" className="w-4 h-4 object-contain" />
          <span>Seleksi Bimbingan Eksklusif GSA 2026 Batch 2</span>
        </div>

        {/* Main Headline Lockup with 3D / Isometric Badges from screenshot */}
        <div className="relative max-w-4xl mx-auto mb-8">
          {/* Left Decorative 3D Pixel Isometric Bracket [✧] */}
          <div className="hidden md:flex absolute -left-12 lg:-left-20 top-2 lg:top-4 items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <div className="relative w-20 h-20 lg:w-28 lg:h-28 drop-shadow-2xl">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* 3D Pixelated Isometric Brackets with Rainbow Gradient */}
                <defs>
                  <linearGradient id="rainbow-bracket" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EA4335" />
                    <stop offset="35%" stopColor="#FBBC05" />
                    <stop offset="70%" stopColor="#34A853" />
                    <stop offset="100%" stopColor="#4285F4" />
                  </linearGradient>
                </defs>
                {/* Outer 3D bracket box */}
                <rect x="12" y="15" width="22" height="70" rx="4" fill="url(#rainbow-bracket)" />
                <rect x="66" y="15" width="22" height="70" rx="4" fill="url(#rainbow-bracket)" />
                <rect x="25" y="15" width="25" height="18" rx="2" fill="url(#rainbow-bracket)" />
                <rect x="25" y="67" width="25" height="18" rx="2" fill="url(#rainbow-bracket)" />
                <rect x="50" y="15" width="25" height="18" rx="2" fill="url(#rainbow-bracket)" />
                <rect x="50" y="67" width="25" height="18" rx="2" fill="url(#rainbow-bracket)" />
                {/* Center sparkling prism diamond */}
                <polygon points="50,28 65,50 50,72 35,50" fill="#FFFFFF" />
                <polygon points="50,34 60,50 50,66 40,50" fill="#FBBC05" />
              </svg>
            </div>
          </div>

          {/* Right Decorative 3D Lightbulb with Rainbow Rim & Star 💡 */}
          <div className="hidden md:flex absolute -right-12 lg:-right-20 top-6 lg:top-8 items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-300">
            <div className="relative w-20 h-20 lg:w-28 lg:h-28 drop-shadow-2xl">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="bulb-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34A853" />
                    <stop offset="40%" stopColor="#4285F4" />
                    <stop offset="70%" stopColor="#FBBC05" />
                    <stop offset="100%" stopColor="#EA4335" />
                  </linearGradient>
                </defs>
                {/* Isometric Bulb 3D layers */}
                <circle cx="50" cy="42" r="32" fill="url(#bulb-rainbow)" />
                <circle cx="48" cy="40" r="26" fill="#FFFFFF" />
                {/* Inner Gemini star */}
                <polygon points="48,22 53,35 66,40 53,45 48,58 43,45 30,40 43,35" fill="url(#rainbow-bracket)" />
                {/* Bulb screw base */}
                <rect x="36" y="70" width="24" height="6" rx="2" fill="#FBBC05" />
                <rect x="38" y="78" width="20" height="6" rx="2" fill="#EA4335" />
                <rect x="42" y="86" width="12" height="5" rx="2" fill="#4285F4" />
              </svg>
            </div>
          </div>

          {/* Giant Bold Typography Exacting the Image */}
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-white uppercase drop-shadow-sm">
            <span className="block">GOOGLE</span>
            <span className="block">STUDENT</span>
            <span className="block">AMBASSADOR</span>
            <span className="inline-flex items-center justify-center gap-3 mt-1 text-white">
              <span>2026 BATCH 2</span>
              <span className="inline-block text-3xl sm:text-5xl md:text-6xl align-middle" role="img" aria-label="eyes">
                👀
              </span>
            </span>
          </h1>
        </div>

        {/* Subtitle & Tagline from the screenshot */}
        <div className="max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white/95">
            Lead, Innovate, Inspire
          </h2>
          <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
            Jadilah leader yang membawa inovasi ke kampusmu. <br className="hidden sm:inline" />
            Shape the future of tech, together with Google.
          </p>
        </div>

        {/* Marquee Credential Card: Kak Syahdika Mentorship & Achievements */}
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/25 rounded-3xl p-6 sm:p-8 text-left shadow-2xl mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
            <div className="flex items-center gap-4">
              {/* Permanent embedded photo of Kak Syahdika */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg bg-blue-950 shrink-0 select-none">
                <img
                  src={mentorPhotoUrl || mentorImg}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = '/mentor_kak_syahdika.jpg';
                  }}
                  alt="Kak Syahdika Kurnia Azhari"
                  className="w-full h-full object-cover object-center pointer-events-none select-none"
                  draggable={false}
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Bimbingan Privat Kak Syahdika
                </h3>
                <p className="text-xs sm:text-sm text-blue-200">
                  Google Student Ambassador Indonesia & Lead Mentor
                </p>
              </div>
            </div>
          </div>

          {/* Key Track Record Facts & Capaian Kak Syahdika */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            <div className="bg-black/25 rounded-2xl p-5 border border-white/10 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                <Trophy className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-emerald-300 block font-display">
                  7 dari 10 Trailblazer
                </span>
                <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed mt-1">
                  Top 10 Trailblazer GSA 2026 Batch 1 dari 2.000 peserta se-Indonesia adalah hasil bimbingan intensif Kak Dika!
                </p>
              </div>
            </div>

            <div className="bg-black/25 rounded-2xl p-5 border border-white/10 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Video className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-amber-300 block font-display">
                  Dokumenter Google
                </span>
                <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed mt-1">
                  Bintang Video Dokumenter Google dalam Implementasi Penggunaan AI Bagi Perempuan Desa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onScrollToForm}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#1052c9] hover:bg-blue-50 font-bold text-base shadow-xl shadow-black/20 transition-all hover:scale-105 active:scale-100 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Users className="w-5 h-5 text-[#1052c9]" />
            <span>Daftar Seleksi Bimbingan</span>
          </button>

          <button
            onClick={onScrollToTrackRecord}
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-base border border-white/30 backdrop-blur-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Award className="w-5 h-5 text-amber-300" />
            <span>Lihat Bukti Track Record</span>
            <ArrowDown className="w-4 h-4 text-blue-200" />
          </button>
        </div>
      </div>
    </section>
  );
};
