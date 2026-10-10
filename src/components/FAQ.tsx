import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah program bimbingan ini berbayar?',
      a: 'Sama sekali TIDAK dipungut biaya (100% GRATIS). Program ini adalah inisiatif sukarela dari Kak Syahdika (Lead Mentor GSA Indonesia & Bintang Video Dokumenter Google) untuk membina generasi penerus Google Student Ambassador agar mampu berprestasi hingga tingkat nasional.',
    },
    {
      q: 'Mengapa kuota dibatasi hanya untuk 50 peserta terpilih?',
      a: 'Di GSA 2026 Batch 1, Kak Dika berhasil membawa 7 dari total 2.000 GSA se-Indonesia menjadi Top 10 Trailblazer karena proses mentoringnya dilakukan secara privat, intensif, dan personal. Kuota 50 orang ini dirancang agar setiap peserta mendapatkan perhatian dan review submission 1-on-1 yang optimal.',
    },
    {
      q: 'Bagaimana alur setelah saya mengirim formulir pendaftaran?',
      a: 'Setelah menekan tombol "Kirim Formulir dan Buka Akses", pendaftaranmu langsung masuk ke akun admin secara online dan realtime. Layar akan menampilkan tautan resmi masuk ke Grup WhatsApp bimbingan untuk informasi kelulusan program.',
    },
    {
      q: 'Apakah mahasiswa dari jurusan non-IT (Sosial/Bisnis/Desain) boleh ikut?',
      a: 'Sangat boleh! Google Student Ambassador membutuhkan mahasiswa lintas disiplin ilmu. Salah satu kekuatan bimbingan Kak Dika adalah mengajarkan bagaimana mahasiswa non-IT dapat memanfaatkan Google Gemini dan Google AI secara praktis untuk menyelesaikan problem nyata di kampus.',
    },
    {
      q: 'Kapan pengumuman 50 peserta yang lolos seleksi bimbingan?',
      a: 'Pengumuman akan dirilis langsung di WhatsApp Group resmi calon bimbingan dan dihubungi secara personal melalui WhatsApp oleh tim Kak Syahdika.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#0a317e] border-t border-white/10 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <p className="mt-3 text-sm sm:text-base text-blue-100/80">
            Hal-hal penting seputar seleksi dan bimbingan private GSA 2026 Batch 2.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-xs rounded-2xl border border-white/15 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-white hover:text-amber-200 transition-colors"
                >
                  <span className="font-bold text-base sm:text-lg">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-amber-300 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm text-blue-100/90 leading-relaxed border-t border-white/10 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
