import React from 'react';
import { Sparkles, Compass, MessageSquareCode, ShieldCheck, Share2, Lightbulb, Users2 } from 'lucide-react';

export const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: Compass,
      title: 'Blueprint Teruji Top 10 Trailblazer',
      desc: 'Bukan sekadar tips umum. Pelajari strategi rinci, matriks penilaian Google, dan roadmap mingguan yang berhasil mengantarkan 7 mentee Batch 1 ke puncak ranking nasional.',
      tag: 'Proven Strategy',
    },
    {
      icon: Lightbulb,
      title: 'Bedah Ide Campaign Google Gemini AI',
      desc: 'Bimbingan khusus menyusun hands-on workshop dan aktivasi Gemini AI di kampusmu yang memiliki nilai engagement tinggi di mata dewan juri Google.',
      tag: 'Google AI Focus',
    },
    {
      icon: MessageSquareCode,
      title: 'Review Submission & Proposal 1-on-1',
      desc: 'Setiap laporan bulanan, proposal event, dan portofolio campaign kamu akan direview langsung oleh Kak Dika sebelum di-submit ke sistem Google.',
      tag: 'Direct Feedback',
    },
    {
      icon: Users2,
      title: 'Grup WhatsApp Privat 50 Ambassador',
      desc: 'Lingkungan suportif beranggotakan 50 calon ambassador terpilih dari seluruh Indonesia. Kolaborasi lintas kampus tanpa persaingan negatif.',
      tag: 'Exclusive Circle',
    },
    {
      icon: ShieldCheck,
      title: 'Mentoring Personal Branding & Pitching',
      desc: 'Kuasai teknik public speaking, menyusun slide presentasi berstandar Google, dan membangun reputasi sebagai tech leader kampus yang diperhitungkan.',
      tag: 'Leadership Skill',
    },
    {
      icon: Share2,
      title: 'Sesi Diskusi Bersama Alumni Trailblazer Batch 1',
      desc: 'Bisa berdiskusi langsung dengan 7 alumni bimbingan Kak Dika yang kini resmi menyandang predikat Top 10 Trailblazer GSA 2026 Batch 1.',
      tag: 'Alumni Network',
    },
  ];

  return (
    <section id="keuntungan" className="py-20 bg-[#092d77] border-t border-white/10 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Privileges & Perks</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display">
            Apa Saja yang Didapatkan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-100 to-white">
              Oleh 50 Peserta Terpilih?
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-blue-100/80 leading-relaxed">
            Semua fasilitas mentoring ini diberikan secara gratis dan intensif khusus bagi 50 GSA 2026 Batch 2 yang lolos kurasi seleksi.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 hover:border-white/30 hover:bg-white/15 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/20 border border-white/10">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-blue-100 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-blue-100/80 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
