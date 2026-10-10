import React from 'react';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

export const Timeline: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Pengisian Formulir Pendaftaran',
      period: 'Gelombang Seleksi Dibuka',
      desc: 'Isi formulir selengkap dan sejujur mungkin, terutama bagian Visi Misi, Motivasi Bimbingan, dan Kalimat tentang Google Gemini.',
      status: 'Sedang Berlangsung',
      highlight: true,
    },
    {
      step: '02',
      title: 'Bergabung ke WhatsApp Group Calon Bimbingan',
      period: 'Segera Setelah Submit',
      desc: 'Setelah menekan tombol submit, kamu akan langsung diarahkan ke tombol WhatsApp Group resmi calon bimbingan.',
      status: 'Wajib Dilakukan',
      highlight: false,
    },
    {
      step: '03',
      title: 'Kurasi & Penilaian Internal oleh Kak Dika',
      period: 'Proses Kurasi Esai',
      desc: 'Kak Syahdika akan meninjau setiap profil dan esai untuk memilih 50 kandidat dengan komitmen & visi paling selaras.',
      status: 'Review Langsung',
      highlight: false,
    },
    {
      step: '04',
      title: 'Pengumuman 50 Peserta Terpilih & Onboarding',
      period: 'Pengumuman Resmi',
      desc: '50 peserta terpilih akan diumumkan di WhatsApp Group & dihubungi personal untuk memulai kickoff mentoring private.',
      status: 'Tahap Akhir',
      highlight: false,
    },
  ];

  return (
    <section id="timeline" className="py-20 bg-[#093282] border-t border-white/10 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>Timeline Alur Seleksi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display">
            Alur Pendaftaran Hingga <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-100">
              Pengumuman 50 Terpilih
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-blue-100/80 leading-relaxed">
            Ikuti setiap langkah dengan teliti untuk memastikan pendaftaranmu terverifikasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 border flex flex-col justify-between transition-all relative overflow-hidden ${
                item.highlight
                  ? 'bg-gradient-to-b from-blue-600/40 to-blue-800/40 border-amber-400/50 shadow-lg shadow-blue-900/40'
                  : 'bg-white/10 backdrop-blur-xs border-white/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-amber-300 font-display">
                    {item.step}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      item.highlight
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-white/10 text-blue-200 border border-white/15'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-blue-200 font-medium mb-3">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  <span>{item.period}</span>
                </div>
                <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
