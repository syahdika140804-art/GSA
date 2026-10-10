import { Applicant, AdminSettings } from '../types';

const STORAGE_APPLICANTS_KEY = 'gsa_bimbingan_applicants_v1';
const STORAGE_SETTINGS_KEY = 'gsa_bimbingan_settings_v1';
export const ADMIN_SECRET_CODE = '123321';

export const DEFAULT_SETTINGS: AdminSettings = {
  whatsappGroupUrl: 'https://chat.whatsapp.com/F52YcJInyIW2XNxwSJkW2U?mode=gi_t',
  selectionTarget: 50,
  registrationOpen: true,
  announcementDate: '2026-10-25',
};

// 1. Fetch Applicants: tries online API first, falls back to localStorage
export async function fetchApplicantsOnline(): Promise<Applicant[]> {
  try {
    const res = await fetch('/api/applicants');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        localStorage.setItem(STORAGE_APPLICANTS_KEY, JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch (err) {
    console.warn('API fetch failed, reading from local fallback:', err);
  }
  return getLocalApplicants();
}

export function getLocalApplicants(): Applicant[] {
  try {
    const raw = localStorage.getItem(STORAGE_APPLICANTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

// 2. Save Applicant: sends to online backend and updates local cache
export async function saveApplicantOnline(
  data: Omit<Applicant, 'id' | 'createdAt' | 'status'>
): Promise<Applicant> {
  const localId = `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const newApplicant: Applicant = {
    ...data,
    id: localId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  // Immediate local cache update
  const localList = [newApplicant, ...getLocalApplicants()];
  try {
    localStorage.setItem(STORAGE_APPLICANTS_KEY, JSON.stringify(localList));
  } catch {
    // ignore
  }

  // Send to online real-time server
  try {
    const res = await fetch('/api/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApplicant),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.error('Failed to post applicant to server, cached locally:', err);
  }

  return newApplicant;
}

// 3. Update Applicant Status: sends to online server
export async function updateApplicantStatusOnline(
  id: string,
  status: Applicant['status'],
  notes?: string
): Promise<Applicant[]> {
  // Local optimistic update
  const current = getLocalApplicants();
  const updatedLocal = current.map((app) => {
    if (app.id === id) {
      return {
        ...app,
        status,
        ...(notes !== undefined ? { adminNotes: notes } : {}),
      };
    }
    return app;
  });
  localStorage.setItem(STORAGE_APPLICANTS_KEY, JSON.stringify(updatedLocal));

  try {
    const res = await fetch(`/api/applicants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes: notes }),
    });
    if (res.ok) {
      // Re-fetch clean list from server
      const refreshed = await fetchApplicantsOnline();
      return refreshed;
    }
  } catch (err) {
    console.error('Failed to patch applicant on server:', err);
  }

  return updatedLocal;
}

// 4. Delete Applicant
export async function deleteApplicantOnline(id: string): Promise<Applicant[]> {
  const current = getLocalApplicants();
  const updatedLocal = current.filter((app) => app.id !== id);
  localStorage.setItem(STORAGE_APPLICANTS_KEY, JSON.stringify(updatedLocal));

  try {
    await fetch(`/api/applicants/${id}`, { method: 'DELETE' });
    return await fetchApplicantsOnline();
  } catch (err) {
    console.error('Failed to delete applicant online:', err);
  }
  return updatedLocal;
}

// 5. Reset Applicants
export async function resetApplicantsOnline(): Promise<Applicant[]> {
  try {
    const res = await fetch('/api/applicants/reset', { method: 'POST' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        localStorage.setItem(STORAGE_APPLICANTS_KEY, JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch (err) {
    console.error('Failed to reset applicants online:', err);
  }
  return getLocalApplicants();
}

// 6. Settings
export async function getSettingsOnline(): Promise<AdminSettings> {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch {
    // fallback
  }

  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }

  return DEFAULT_SETTINGS;
}

export async function saveSettingsOnline(settings: AdminSettings): Promise<void> {
  localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
  } catch (err) {
    console.error('Failed to save settings online:', err);
  }
}

// 7. Mentor Photo API
export async function uploadMentorPhotoOnline(
  photoBase64: string
): Promise<{ success: boolean; photoUrl?: string; message?: string }> {
  try {
    const res = await fetch('/api/mentor-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoBase64 }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    console.error('Failed to upload mentor photo:', err);
    return { success: false, message: err.message || 'Gagal koneksi ke server' };
  }
}

export async function getMentorPhotoOnline(): Promise<string> {
  try {
    const res = await fetch('/api/mentor-photo');
    if (res.ok) {
      const json = await res.json();
      if (json.photoUrl) return json.photoUrl;
    }
  } catch {
    // fallback
  }
  return '/mentor_kak_syahdika.jpg';
}

// 8. Subscribe to Realtime SSE events across all devices (Applicants + Settings + Photo)
export function subscribeToRealtimeApplicants(
  onUpdate: (applicants: Applicant[]) => void,
  onSettingsUpdate?: (settings: AdminSettings) => void
): () => void {
  let eventSource: EventSource | null = null;
  let intervalId: any = null;

  try {
    eventSource = new EventSource('/api/applicants/stream');

    eventSource.addEventListener('applicants_updated', (e) => {
      try {
        const data = JSON.parse(e.data);
        if (Array.isArray(data)) {
          localStorage.setItem(STORAGE_APPLICANTS_KEY, JSON.stringify(data));
          onUpdate(data);
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    });

    eventSource.addEventListener('new_applicant', async () => {
      const latest = await fetchApplicantsOnline();
      onUpdate(latest);
    });

    eventSource.addEventListener('settings_updated', (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data && onSettingsUpdate) {
          localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(data));
          onSettingsUpdate(data);
        }
      } catch (err) {
        console.error('SSE settings parse error:', err);
      }
    });

    eventSource.addEventListener('mentor_photo_updated', (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data && data.photoUrl && onSettingsUpdate) {
          getSettingsOnline().then(onSettingsUpdate);
        }
      } catch (err) {
        console.error('SSE photo parse error:', err);
      }
    });

    eventSource.onerror = () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  } catch {
    // EventSource not supported
  }

  // Active polling every 5 seconds as reliable fallback across any network
  intervalId = setInterval(async () => {
    try {
      const latest = await fetchApplicantsOnline();
      onUpdate(latest);
      if (onSettingsUpdate) {
        const st = await getSettingsOnline();
        onSettingsUpdate(st);
      }
    } catch {
      // ignore
    }
  }, 5000);

  return () => {
    if (eventSource) eventSource.close();
    if (intervalId) clearInterval(intervalId);
  };
}

// Export CSV utility
export function exportApplicantsToCSV(applicants: Applicant[]): void {
  const headers = [
    'ID',
    'Tanggal Daftar',
    'Nama Lengkap',
    'Nomor WhatsApp',
    'Email',
    'Kampus',
    'Jurusan',
    'Semester',
    'Status Seleksi',
    'Visi & Misi di GSA',
    'Motivasi Bimbingan',
    'Kalimat Google Gemini / AI',
    'Portofolio / LinkedIn',
    'Catatan Admin',
  ];

  const rows = applicants.map((a) => [
    `"${a.id}"`,
    `"${new Date(a.createdAt).toLocaleString('id-ID')}"`,
    `"${(a.fullName || '').replace(/"/g, '""')}"`,
    `"${(a.whatsapp || '').replace(/"/g, '""')}"`,
    `"${(a.email || '').replace(/"/g, '""')}"`,
    `"${(a.campus || '').replace(/"/g, '""')}"`,
    `"${(a.major || '').replace(/"/g, '""')}"`,
    `"${(a.semester || '').replace(/"/g, '""')}"`,
    `"${a.status}"`,
    `"${(a.visionMission || '').replace(/"/g, '""')}"`,
    `"${(a.motivation || '').replace(/"/g, '""')}"`,
    `"${(a.geminiStatement || '').replace(/"/g, '""')}"`,
    `"${(a.portfolioLink || '').replace(/"/g, '""')}"`,
    `"${(a.adminNotes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Pendaftar_Bimbingan_GSA2026_KakDika_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
