import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Check,
  Sparkles,
  RefreshCw,
  Crop,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { uploadMentorPhotoOnline } from '../services/storage';

interface PhotoCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl?: string;
  onPhotoSaved: (newPhotoUrl: string) => void;
}

type AspectRatioType = '1:1' | '4:5' | '3:4';

export const PhotoCropModal: React.FC<PhotoCropModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  onPhotoSaved,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [previewShape, setPreviewShape] = useState<'rounded' | 'circle'>('rounded');

  // Dragging state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Processing state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  // Initialize with current photo if available
  useEffect(() => {
    if (isOpen && !imageSrc && currentPhotoUrl) {
      setImageSrc(currentPhotoUrl);
    }
  }, [isOpen, currentPhotoUrl, imageSrc]);

  // Load image object whenever imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imgElementRef.current = img;
      // Auto-fit initial zoom
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setRotation(0);
      drawEditor();
      generatePreview();
    };
    img.onerror = () => {
      setErrorMessage('Gagal memuat gambar. Pastikan format file didukung (JPG, PNG, WebP).');
    };
  }, [imageSrc]);

  // Re-draw editor canvas
  const drawEditor = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgElementRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Save state
    ctx.save();

    // Center and transform
    ctx.translate(width / 2 + offset.x, height / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate aspect ratio fit
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;

    let drawW: number;
    let drawH: number;

    if (imgAspect > canvasAspect) {
      drawH = height;
      drawW = height * imgAspect;
    } else {
      drawW = width;
      drawH = width / imgAspect;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();
  }, [zoom, offset, rotation]);

  // Generate live thumbnail preview
  const generatePreview = useCallback(() => {
    const previewCanvas = previewCanvasRef.current;
    const img = imgElementRef.current;
    const mainCanvas = canvasRef.current;
    if (!previewCanvas || !img || !mainCanvas) return;

    const ctx = previewCanvas.getContext('2d');
    if (!ctx) return;

    const pW = previewCanvas.width;
    const pH = previewCanvas.height;
    ctx.clearRect(0, 0, pW, pH);

    // Draw what is inside the main canvas into the preview
    ctx.drawImage(mainCanvas, 0, 0, pW, pH);
  }, []);

  useEffect(() => {
    drawEditor();
    generatePreview();
  }, [drawEditor, generatePreview, zoom, offset, rotation, aspectRatio]);

  // Drag / Pan handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setOffset({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragStartRef.current = { x: touch.clientX - offset.x, y: touch.clientY - offset.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStartRef.current.x;
    const newY = touch.clientY - dragStartRef.current.y;
    setOffset({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom handlers
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3.5, Number((prev + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(1, Number((prev - 0.15).toFixed(2))));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setRotation(0);
    setErrorMessage(null);
  };

  // Perform Final Crop & Upload Permanently to Server
  const handleCropAndSave = async () => {
    const img = imgElementRef.current;
    if (!img) {
      setErrorMessage('Pilih gambar terlebih dahulu.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(null);

    try {
      // Export at high resolution: 1024x1024 (or 960x1200 for 4:5)
      const exportCanvas = document.createElement('canvas');
      const exportSize = aspectRatio === '4:5' ? { w: 960, h: 1200 } : aspectRatio === '3:4' ? { w: 960, h: 1280 } : { w: 1024, h: 1024 };

      exportCanvas.width = exportSize.w;
      exportCanvas.height = exportSize.h;
      const ctx = exportCanvas.getContext('2d');

      if (!ctx) throw new Error('Gagal menginisialisasi canvas rendering.');

      // Scale factor relative to the interactive editor canvas (400x400)
      const scaleMultiplier = exportSize.w / 400;

      ctx.save();
      ctx.translate(exportSize.w / 2 + offset.x * scaleMultiplier, exportSize.h / 2 + offset.y * scaleMultiplier);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom * scaleMultiplier, zoom * scaleMultiplier);

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const editorAspect = 400 / 400;

      let drawW: number;
      let drawH: number;

      if (imgAspect > editorAspect) {
        drawH = 400;
        drawW = 400 * imgAspect;
      } else {
        drawW = 400;
        drawH = 400 / imgAspect;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Convert to Base64 JPEG with high quality 0.95
      const highResDataUrl = exportCanvas.toDataURL('image/jpeg', 0.95);

      // Upload to server endpoint /api/mentor-photo
      const res = await uploadMentorPhotoOnline(highResDataUrl);

      setIsSaving(false);

      if (res.success && res.photoUrl) {
        setSaveSuccess('✓ Foto Kak Syahdika berhasil dipotong, disesuaikan, dan ditanam permanen ke server!');
        onPhotoSaved(res.photoUrl);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMessage(res.message || 'Gagal menyimpan foto ke server.');
      }
    } catch (err: any) {
      setIsSaving(false);
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses foto.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[94vh] bg-slate-900 text-slate-100 rounded-3xl shadow-2xl flex flex-col border border-slate-700 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/25 border border-blue-400/40 text-blue-400 flex items-center justify-center">
              <Crop className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                <span>Sesuaikan & Pas-kan Foto Kak Syahdika</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                  Crop & Zoom Tool
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Potong, perbesar, atau geser foto agar wajah dan postur pas sebelum ditanam permanen
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Status Banners */}
          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{saveSuccess}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs sm:text-sm font-medium flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Main Grid: Left is Interactive Editor, Right is Live Previews & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Interactive Canvas Viewport & Controls */}
            <div className="lg:col-span-7 flex flex-col items-center gap-4">
              
              {/* Top Viewport Toolbar */}
              <div className="w-full flex items-center justify-between gap-2 px-1 text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-blue-400" />
                  <span>Tarik/Geser foto untuk mempaskan posisi</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                      showGrid
                        ? 'bg-blue-600/30 text-blue-300 border-blue-400/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title="Garis bantu komposisi"
                  >
                    Garis Bantu
                  </button>
                  <button
                    onClick={() => setPreviewShape(previewShape === 'rounded' ? 'circle' : 'rounded')}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 font-medium transition-colors"
                  >
                    Bentuk: {previewShape === 'circle' ? 'Lingkaran' : 'Kotak'}
                  </button>
                </div>
              </div>

              {/* Viewport Box (Interactive Frame) */}
              <div
                className={`relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] bg-slate-950 border-2 border-blue-500/60 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none flex items-center justify-center ${
                  previewShape === 'circle' ? 'rounded-full' : 'rounded-3xl'
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* 400x400 internal resolution canvas */}
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="w-full h-full object-contain pointer-events-none"
                />

                {/* Grid Overlay (Rule of Thirds) */}
                {showGrid && (
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                    <div className="border-r border-b border-white/20" />
                    <div className="border-r border-b border-white/20" />
                    <div className="border-b border-white/20" />
                    <div className="border-r border-b border-white/20" />
                    <div className="border-r border-b border-white/20" />
                    <div className="border-b border-white/20" />
                    <div className="border-r border-white/20" />
                    <div className="border-r border-white/20" />
                    <div />
                  </div>
                )}

                {/* Guidance Overlay Hint */}
                <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] text-white/90 font-medium">
                    🔍 Geser mouse/sentuh layar untuk memindahkan fokus
                  </span>
                </div>
              </div>

              {/* Zoom & Adjustment Sliders */}
              <div className="w-full bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3.5">
                {/* Zoom Control */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-blue-400" />
                      <span>Perbesar / Perkecil (Zoom)</span>
                    </span>
                    <span className="text-blue-300 font-mono font-bold">
                      {Math.round(zoom * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleZoomOut}
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                      title="Perkecil"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="3.5"
                      step="0.05"
                      value={zoom}
                      onChange={handleZoomChange}
                      className="flex-1 accent-blue-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <button
                      onClick={handleZoomIn}
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                      title="Perbesar"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Alignment & Rotate Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRotate}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs text-slate-200 font-medium transition-colors cursor-pointer"
                      title="Putar 90 derajat searah jarum jam"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-amber-300" />
                      <span>Putar 90°</span>
                    </button>

                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs text-slate-200 font-medium transition-colors cursor-pointer"
                      title="Kembalikan posisi & zoom awal"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-blue-300" />
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700 text-[11px] text-slate-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>Foto Resmi Kak Syahdika</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Live Previews & Save Button */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Preview Hasil di Website</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Realtime Sync
                  </span>
                </div>

                {/* Preview 1: Hero Section Card Style */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                    1. Tampilan Kartu Bimbingan Privat (Hero):
                  </span>
                  <div className="bg-gradient-to-br from-blue-900/60 to-blue-950/80 p-3.5 rounded-2xl border border-blue-400/30 flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg bg-blue-950 shrink-0">
                      <canvas
                        ref={previewCanvasRef}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        Bimbingan Privat Kak Syahdika
                      </p>
                      <p className="text-[10px] text-blue-200 truncate">
                        Lead Mentor GSA 2026 Batch 2
                      </p>
                      <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-medium">
                        ✓ Pas & Rapi di Tengah
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preview 2: Spotlight Profile Track Record (Aspect Square) */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                    2. Tampilan Kartu Profil Track Record:
                  </span>
                  <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-700">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/20 shadow-md bg-blue-950 shrink-0">
                      <canvas
                        width={120}
                        height={120}
                        ref={(el) => {
                          if (el && canvasRef.current) {
                            const ctx = el.getContext('2d');
                            if (ctx) ctx.drawImage(canvasRef.current, 0, 0, 120, 120);
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-[11px] text-slate-300 leading-snug">
                      <strong className="text-white block font-semibold text-xs">
                        Kak Syahdika Kurnia Azhari
                      </strong>
                      <span className="text-amber-300 text-[10px] block">
                        Google Student Ambassador Indonesia
                      </span>
                      <p className="text-slate-400 text-[10px] mt-1 line-clamp-2">
                        “Tugas seorang GSA menciptakan dampak riil inovasi teknologi di kampusmu.”
                      </p>
                    </div>
                  </div>
                </div>

                {/* Aspect Ratio Picker */}
                <div className="pt-2 border-t border-slate-700">
                  <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                    Rasio Potongan:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setAspectRatio('1:1')}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        aspectRatio === '1:1'
                          ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-700 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span>1:1 Persegi</span>
                      <span className="block text-[9px] opacity-80">(Rekomendasi)</span>
                    </button>

                    <button
                      onClick={() => setAspectRatio('4:5')}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        aspectRatio === '4:5'
                          ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-700 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span>4:5 Portrait</span>
                      <span className="block text-[9px] opacity-80">(Vertikal)</span>
                    </button>

                    <button
                      onClick={() => setAspectRatio('3:4')}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        aspectRatio === '3:4'
                          ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-700 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span>3:4 Standar</span>
                      <span className="block text-[9px] opacity-80">(Foto Rapi)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON: Potong & Tanam Permanen */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCropAndSave}
                  disabled={isSaving || !imageSrc}
                  className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Menanam Foto Permanen ke Server...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-300" />
                      <span>Potong & Tanam Foto Permanen</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center leading-tight">
                  🔒 Foto hasil potongan dan perbesaran ini otomatis disimpan permanen di server disk dan langsung aktif untuk seluruh pengunjung website.
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
