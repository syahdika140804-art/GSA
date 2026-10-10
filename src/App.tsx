/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrackRecord } from './components/TrackRecord';
import { Benefits } from './components/Benefits';
import { Prerequisites } from './components/Prerequisites';
import { Timeline } from './components/Timeline';
import { RegistrationForm } from './components/RegistrationForm';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { SuccessModal } from './components/SuccessModal';
import { AdminPortal } from './components/AdminPortal';
import { Applicant, AdminSettings } from './types';
import {
  fetchApplicantsOnline,
  getSettingsOnline,
  subscribeToRealtimeApplicants,
  DEFAULT_SETTINGS,
} from './services/storage';

export default function App() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [submittedApplicant, setSubmittedApplicant] = useState<Applicant | null>(null);

  useEffect(() => {
    // Initial fetch from online server
    fetchApplicantsOnline().then(setApplicants);
    getSettingsOnline().then(setSettings);

    // Subscribe to live SSE updates & periodic heartbeat so all devices sync in realtime
    const unsubscribe = subscribeToRealtimeApplicants(
      (updatedList) => {
        setApplicants(updatedList);
      },
      (updatedSettings) => {
        setSettings(updatedSettings);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleScrollToForm = () => {
    const el = document.getElementById('daftar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTrackRecord = () => {
    const el = document.getElementById('track-record');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegistrationSuccess = (newApplicant: Applicant) => {
    setSubmittedApplicant(newApplicant);
    fetchApplicantsOnline().then(setApplicants);
  };

  return (
    <div className="min-h-screen bg-[#0b388f] text-slate-100 flex flex-col font-sans selection:bg-[#4285F4] selection:text-white">
      {/* Floating Pill Header matching image.png */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        onScrollToForm={handleScrollToForm}
        isAdminLoggedIn={isAdminAuthenticated}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onScrollToForm={handleScrollToForm}
          onScrollToTrackRecord={handleScrollToTrackRecord}
          mentorPhotoUrl={settings.mentorPhotoUrl}
        />

        {/* Track Record & Proof of Kak Syahdika */}
        <TrackRecord mentorPhotoUrl={settings.mentorPhotoUrl} />

        {/* Keuntungan Bimbingan Private untuk 50 Terpilih */}
        <Benefits />

        {/* Kriteria & Prasyarat Seleksi 50 Peserta */}
        <Prerequisites />

        {/* Timeline Seleksi */}
        <Timeline />

        {/* Formulir Pendaftaran Seleksi */}
        <RegistrationForm onSuccess={handleRegistrationSuccess} />

        {/* Pertanyaan yang Sering Diajukan (FAQ) */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Success Modal with WhatsApp Group Button */}
      <SuccessModal
        applicant={submittedApplicant}
        whatsappGroupUrl={settings.whatsappGroupUrl}
        onClose={() => setSubmittedApplicant(null)}
      />

      {/* Secret Admin Portal (Password 123321) */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        applicants={applicants}
        settings={settings}
        onDataChange={(updated) => setApplicants(updated)}
        onSettingsChange={(updated) => setSettings(updated)}
        isAuthenticated={isAdminAuthenticated}
        setIsAuthenticated={setIsAdminAuthenticated}
      />
    </div>
  );
}
