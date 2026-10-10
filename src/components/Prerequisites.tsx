import React from 'react';
import { CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export const Prerequisites: React.FC = () => {
  const criteria = [
    {
      title: 'Status Mahasiswa Aktif',
      desc: 'Mahasiswa aktif Diploma/S1 dari universitas, politeknik, institut, atau sekolah tinggi di seluruh Indonesia.',
    },
    {
      title: 'Kandidat GSA 2026 Batch 2',
      desc: 'Telah terdaftar, sedang mendaftar, atau bersiap aktif menjadi Google Student Ambassador 2026 Batch 2.',
    },
    {
      title: 'Komitmen & Daya Juang Tinggi',
      desc: 'Siap meluangkan waktu untuk bimbingan berkala, eksekusi program di kampus, dan tidak mudah menyerah di tengah jalan.',
    },
    {
      title: 'Antusiasme Tinggi Terhadap Google AI',
      desc: 'Memiliki rasa ingin tahu untuk mengeksplorasi Google Gemini, Google AI Studio, dan implementasi teknologi ke lingkungan kampus.',
    },
    {
      title: 'Siap Berkolaborasi & Berbagi',
      desc: 'Bersedia aktif berdiskusi di WhatsApp Group bimbingan dan saling mendukung 49 rekan ambassador terpilih lainnya.',
    },
  ];

  return (
    <section id="prasyarat" className="py-20 bg-[#08286a] border-t border-white/10 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-400/15 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Kriteria Seleksi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display mb-4">
              Siapa Saja yang Kami Cari <br />
              <span className="text-amber-300">untuk 50 Kuota Ini?</span>
            </h2>
            <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed mb-6">
              Karena kuota bimbingan dibatasi ketat hanya 50 orang agar Kak Dika bisa memberikan bimbingan 1-on-1 yang intensif, seleksi akan menilai kesungguhan, visi, dan motivasimu dari formulir pendaftaran.
            </p>

            <div className="bg-amber-400/10 border border-amber-400/25 rounded-2xl p-5 text-xs sm:text-sm text-amber-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block mb-1">Catatan Penting:</span>
                Bimbingan ini 100% GRATIS dan tidak dipungut biaya apapun. Penilaian murni berdasarkan kesungguhan esai jawabanmu di formulir.
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {criteria.map((c, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/15 flex items-start gap-4 hover:border-white/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{c.title}</h3>
                  <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
