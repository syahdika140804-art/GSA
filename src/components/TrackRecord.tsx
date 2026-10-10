import React from 'react';
import { Award, Trophy, Users, CheckCircle2, Star, Sparkles, TrendingUp, Video } from 'lucide-react';
import mentorImg from '../assets/images/mentor_kak_syahdika.jpg';
import showcaseImg from '../assets/images/gsa_trailblazer_showcase_1791559773587.jpg';

interface TrackRecordProps {
  mentorPhotoUrl?: string;
}

export const TrackRecord: React.FC<TrackRecordProps> = ({ mentorPhotoUrl }) => {
  return (
    <section id="track-record" className="py-20 relative bg-gradient-to-b from-[#0a2f7c] to-[#0b388f] border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Proven Track Record & Evidence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display">
            Bukan Sekadar Teori, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
              Hasil Nyata Terbukti di Lapangan
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-blue-100/90 leading-relaxed">
            Dipandu langsung oleh Kak Syahdika, Google Student Ambassador Indonesia yang telah membuktikan sistem mentoringnya di tingkat nasional.
          </p>
        </div>

        {/* 2-Column Spotlight Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-14">
          {/* Mentor Profile Card */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-400/20 blur-3xl pointer-events-none" />
            
            <div>
              {/* Permanent embedded photo of Kak Syahdika */}
              <div className="relative mb-6 rounded-2xl overflow-hidden aspect-square border-2 border-white/30 shadow-lg bg-blue-950 select-none">
                <img
                  src={mentorPhotoUrl || mentorImg}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = '/mentor_kak_syahdika.jpg';
                  }}
                  alt="Kak Syahdika Kurnia Azhari - Lead GSA Mentor"
                  className="w-full h-full object-cover object-center pointer-events-none select-none"
                  draggable={false}
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">
                Kak Syahdika Kurnia Azhari
              </h3>
              <p className="text-sm font-medium text-amber-300 mb-4">
                Google Student Ambassador Indonesia · Lead GSA Mentor
              </p>
              <p className="text-sm text-blue-100 leading-relaxed mb-6">
                “Tugas seorang Google Student Ambassador bukan hanya memasang logo Google di bio, melainkan menciptakan dampak riil inovasi teknologi dan AI di kampusmu. Saya siap mendampingi kamu langkah demi langkah.”
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/15 text-xs sm:text-sm text-blue-100">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-semibold text-amber-200">
                  Bintang Video Dokumenter Google dalam Implementasi Penggunaan AI Bagi Perempuan Desa
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Mentor Resmi 7 dari Top 10 Trailblazer GSA 2026 Batch 1 se-Indonesia</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Spesialis Implementasi Google Gemini & Kampus AI</span>
              </div>
            </div>
          </div>

          {/* Incredible Batch 1 Record Showcase */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            {/* The Big Highlight Stat Box */}
            <div className="bg-gradient-to-br from-blue-600/40 via-indigo-600/30 to-blue-900/50 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
                <TrendingUp className="w-4 h-4" />
                <span>Statistik Spektakuler GSA 2026 Batch 1</span>
              </div>

              <div className="flex flex-col sm:flex-row items-baseline gap-2 sm:gap-4 mb-4">
                <span className="text-5xl sm:text-6xl md:text-7xl font-black text-white font-display">
                  7 / 10
                </span>
                <span className="text-xl sm:text-2xl font-bold text-amber-300">
                  Top 10 Trailblazer Nasional
                </span>
              </div>

              <p className="text-sm sm:text-base text-blue-100 leading-relaxed mb-6">
                Dari total <strong>2.000 Google Student Ambassador (GSA)</strong> di Batch 1 seluruh perguruan tinggi Indonesia, <strong>7 peserta yang meraih gelar Top 10 Trailblazer</strong> adalah mentee yang dibimbing langsung secara privat oleh Kak Syahdika!
              </p>

              {/* Progress bar visual comparison */}
              <div className="bg-black/30 rounded-2xl p-4 border border-white/10 space-y-3">
                <div className="flex justify-between text-xs font-semibold text-blue-200">
                  <span>Dominasi Mentee Kak Dika di Top 10</span>
                  <span className="text-amber-300">70% dari Top 10</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden flex">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full transition-all duration-1000 w-[70%]" />
                  <div className="bg-white/20 h-full w-[30%]" />
                </div>
                <div className="flex justify-between text-[11px] text-blue-200/80">
                  <span>7 Mentee Kak Dika</span>
                  <span>3 Peserta lainnya se-Indonesia</span>
                </div>
              </div>
            </div>

            {/* Photo Documentation Showcase */}
            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-xl group">
              <img
                src={showcaseImg}
                alt="Selebrasi Para Mahasiswa GSA & Tech Ambassador"
                className="w-full h-56 sm:h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Komunitas Berprestasi & Berdampak Luas</span>
                </div>
                <h4 className="text-white text-base sm:text-lg font-bold">
                  Kini Giliran Kamu di GSA 2026 Batch 2!
                </h4>
                <p className="text-blue-100 text-xs sm:text-sm">
                  Kak Dika hanya membuka 50 kursi terpilih agar bimbingan dapat berlangsung intensif, private, dan fokus pada target masing-masing ambassador.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Mentoring */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-6 border border-white/15">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-4">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Kurikulum Teruji Top 1</h4>
            <p className="text-sm text-blue-100/80 leading-relaxed">
              Materi disusun berdasarkan pengalaman nyata memenangkan peringkat 1 nasional dan meloloskan mentee terbanyak ke jajaran Trailblazer.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-6 border border-white/15">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-emerald-300" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Private & Eksklusif 50 Orang</h4>
            <p className="text-sm text-blue-100/80 leading-relaxed">
              Bukan webinar massal ribuan orang. Kamu mendapatkan akses langsung via WhatsApp Group privat dan sesi konsultasi personal.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-6 border border-white/15">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Fokus Google Gemini & AI</h4>
            <p className="text-sm text-blue-100/80 leading-relaxed">
              Dapatkan arahan praktis menyelenggarakan event AI, demo aplikasi Gemini, dan kampanye teknologi yang disukai Google team.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
