import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS middleware
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (_req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const APPLICANTS_FILE = path.join(__dirname, 'data', 'applicants.json');
const SETTINGS_FILE = path.join(__dirname, 'data', 'settings.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Helper to read applicants
function readApplicants(): any[] {
  try {
    if (fs.existsSync(APPLICANTS_FILE)) {
      const data = fs.readFileSync(APPLICANTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading applicants file:', err);
  }
  return [];
}

// Helper to write applicants
function writeApplicants(data: any[]): void {
  try {
    fs.writeFileSync(APPLICANTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing applicants file:', err);
  }
}

// Helper to read settings
function readSettings(): any {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading settings file:', err);
  }
  return {
    whatsappGroupUrl: 'https://chat.whatsapp.com/F52YcJInyIW2XNxwSJkW2U?mode=gi_t',
    selectionTarget: 50,
    registrationOpen: true,
    announcementDate: '2026-10-25',
  };
}

// Helper to write settings
function writeSettings(data: any): void {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing settings file:', err);
  }
}

// SSE Clients for Real-time Online Sync
let sseClients: Response[] = [];

function broadcastSSE(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(payload);
    } catch {
      // client disconnected
    }
  });
}

// 1. SSE Stream for Real-time Updates across all devices
app.get('/api/applicants/stream', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  res.write(`event: connected\ndata: ${JSON.stringify({ time: new Date().toISOString() })}\n\n`);
  sseClients.push(res);

  // Keep-alive ping every 25 seconds
  const keepAlive = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      clearInterval(keepAlive);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(keepAlive);
    sseClients = sseClients.filter((c) => c !== res);
  });
});

// 2. GET all applicants
app.get('/api/applicants', (_req: Request, res: Response) => {
  const applicants = readApplicants();
  res.json({ success: true, data: applicants });
});

// 3. POST new applicant (submitted from any device)
app.post('/api/applicants', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.fullName || !body.whatsapp || !body.email || !body.campus) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
  }

  const applicants = readApplicants();
  const newApplicant = {
    ...body,
    id: body.id || `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: body.status || 'pending',
    createdAt: body.createdAt || new Date().toISOString(),
  };

  const updated = [newApplicant, ...applicants];
  writeApplicants(updated);

  // Broadcast real-time to all connected admins & devices
  broadcastSSE('new_applicant', newApplicant);
  broadcastSSE('applicants_updated', updated);

  console.log(`[Online Realtime] New applicant registered: ${newApplicant.fullName} (${newApplicant.campus})`);
  return res.status(201).json({ success: true, data: newApplicant });
});

// 4. PATCH update applicant status / notes
app.patch('/api/applicants/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  const applicants = readApplicants();

  let target: any = null;
  const updated = applicants.map((app) => {
    if (app.id === id) {
      target = {
        ...app,
        ...(status ? { status } : {}),
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      };
      return target;
    }
    return app;
  });

  if (!target) {
    return res.status(404).json({ success: false, message: 'Applicant tidak ditemukan' });
  }

  writeApplicants(updated);
  broadcastSSE('applicant_updated', target);
  broadcastSSE('applicants_updated', updated);

  return res.json({ success: true, data: target });
});

// 5. DELETE applicant
app.delete('/api/applicants/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const applicants = readApplicants();
  const updated = applicants.filter((a) => a.id !== id);

  writeApplicants(updated);
  broadcastSSE('applicants_updated', updated);

  return res.json({ success: true, message: 'Berhasil dihapus' });
});

// 6. GET Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  const settings = readSettings();
  res.json({ success: true, data: settings });
});

// 7. POST Settings
app.post('/api/settings', (req: Request, res: Response) => {
  const current = readSettings();
  const updated = { ...current, ...req.body };
  writeSettings(updated);
  broadcastSSE('settings_updated', updated);
  res.json({ success: true, data: updated });
});

// 8. Plant & Update Permanent Mentor Photo
app.post('/api/mentor-photo', (req: Request, res: Response) => {
  try {
    const { photoBase64 } = req.body;
    if (!photoBase64) {
      return res.status(400).json({ success: false, message: 'photoBase64 is required' });
    }

    const matches = photoBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const base64Data = matches ? matches[2] : photoBase64;
    const buffer = Buffer.from(base64Data, 'base64');

    const publicPath = path.join(__dirname, 'public', 'mentor_kak_syahdika.jpg');
    const assetsPath = path.join(__dirname, 'src', 'assets', 'images', 'mentor_kak_syahdika.jpg');

    fs.writeFileSync(publicPath, buffer);
    fs.writeFileSync(assetsPath, buffer);

    const version = Date.now();
    const photoUrl = `/mentor_kak_syahdika.jpg?v=${version}`;

    const settings = readSettings();
    settings.mentorPhotoUrl = photoUrl;
    settings.mentorPhotoUpdated = new Date().toISOString();
    writeSettings(settings);

    broadcastSSE('mentor_photo_updated', {
      photoUrl,
      updatedAt: settings.mentorPhotoUpdated,
    });
    broadcastSSE('settings_updated', settings);

    console.log('[Mentor Photo] Successfully planted permanent mentor photo to disk!');
    return res.json({
      success: true,
      message: 'Foto Kak Syahdika berhasil ditanam permanen ke server dan website!',
      photoUrl,
    });
  } catch (err: any) {
    console.error('Error planting mentor photo:', err);
    return res.status(500).json({ success: false, message: err.message || 'Gagal menyimpan foto' });
  }
});

// GET Current Mentor Photo Info
app.get('/api/mentor-photo', (_req: Request, res: Response) => {
  const settings = readSettings();
  res.json({
    success: true,
    photoUrl: settings.mentorPhotoUrl || '/mentor_kak_syahdika.jpg',
    updatedAt: settings.mentorPhotoUpdated || null,
  });
});

// 9. Reset Sample Data
app.post('/api/applicants/reset', (_req: Request, res: Response) => {
  const sample = [
    {
      id: 'app-001',
      fullName: 'Fathur Rahman Al-Fikri',
      whatsapp: '081265439812',
      email: 'fathur.rahman@polmed.ac.id',
      campus: 'Politeknik Negeri Medan (Polmed)',
      major: 'Teknik Komputer & Jaringan',
      semester: 'Semester 5',
      visionMission: 'Membangun ekosistem developer kampus yang melek Google AI dan membawa nama Polmed ke jajaran Top Trailblazer nasional.',
      motivation: 'Sangat terinspirasi oleh Kak Syahdika yang membawa 7 orang tembus Top 10 Trailblazer di Batch 1. Saya ingin bimbingan langsung cara menyusun program kerja dan impact yang terukur.',
      geminiStatement: 'Google Gemini adalah akselerator kecerdasan manusia yang mengubah ide konseptual mahasiswa menjadi solusi nyata dalam hitungan detik.',
      portfolioLink: 'https://linkedin.com/in/fathur-rahman-dev',
      status: 'selected',
      adminNotes: 'Track record organisasi kuat, visi jelas untuk kampus vokasi.',
      createdAt: '2026-10-09T03:15:00.000Z',
    },
    {
      id: 'app-002',
      fullName: 'Anindya Putri Savitri',
      whatsapp: '082187654321',
      email: 'anindya.putri@ui.ac.id',
      campus: 'Universitas Indonesia (UI)',
      major: 'Sistem Informasi',
      semester: 'Semester 3',
      visionMission: 'Mengedukasi 500+ mahasiswa lintas jurusan tentang etika dan pemanfaatan praktis generative AI untuk produktivitas riset.',
      motivation: 'Kak Dika berhasil membimbing alumni GSA Batch 1 dengan metodologi yang sangat sistematis. Saya ingin belajar strategi campaign viral dan engagement tinggi.',
      geminiStatement: 'Google AI adalah jembatan demokratisasi teknologi masa depan bagi seluruh mahasiswa tanpa batasan latar belakang.',
      portfolioLink: 'https://github.com/anindyaps',
      status: 'selected',
      adminNotes: 'Proposal workshop AI sangat matang.',
      createdAt: '2026-10-09T04:20:00.000Z',
    },
    {
      id: 'app-003',
      fullName: 'Rian Bagas Pratama',
      whatsapp: '085712345678',
      email: 'rian.bagas@itb.ac.id',
      campus: 'Institut Teknologi Bandung (ITB)',
      major: 'Teknik Informatika',
      semester: 'Semester 5',
      visionMission: 'Menginisiasi Google AI Hackathon di Bandung bersama komunitas developer mahasiswa.',
      motivation: 'Ingin mendapatkan review tugas dan strategi submission langsung dari Top 1 GSA 2025 agar karya berdampak maksimal.',
      geminiStatement: 'Gemini adalah katalisator riset mutakhir yang menyederhanakan kompleksitas komputasi menjadi pengalaman intuitif.',
      portfolioLink: 'https://linkedin.com/in/rianbagas',
      status: 'shortlist',
      adminNotes: 'Kemampuan teknis tinggi, perlu diperkuat aspek leadership publik.',
      createdAt: '2026-10-09T05:05:00.000Z',
    },
  ];

  writeApplicants(sample);
  broadcastSSE('applicants_updated', sample);
  res.json({ success: true, data: sample });
});

// Start Server with Vite Integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server online and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
