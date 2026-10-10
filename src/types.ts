export interface Applicant {
  id: string;
  fullName: string;
  whatsapp: string;
  email: string;
  campus: string;
  major: string;
  semester: string;
  visionMission: string;
  motivation: string;
  geminiStatement: string;
  portfolioLink?: string;
  status: 'pending' | 'selected' | 'shortlist' | 'rejected';
  adminNotes?: string;
  createdAt: string;
}

export interface AdminSettings {
  whatsappGroupUrl: string;
  selectionTarget: number;
  registrationOpen: boolean;
  announcementDate: string;
  mentorPhotoUrl?: string;
  mentorPhotoUpdated?: string;
}
