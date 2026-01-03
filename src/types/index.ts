export type ProjectStatus = 'PLANNED' | 'EXECUTING' | 'COMPLETED' | 'CANCELLED';

export type ProjectType =
  | 'EVENT'
  | 'TRAINING'
  | 'INSTITUTIONAL_ACTION'
  | 'SOCIAL_PROJECT'
  | 'EXTERNAL_PARTNERSHIP';

export type TargetAudience =
  | 'YOUNG_ENTREPRENEURS'
  | 'ACIM_MEMBERS'
  | 'EXTERNAL_PUBLIC'
  | 'COPEJEM_MEMBERS'
  | 'OTHER';

export interface ProjectPartner {
  name: string;
  type: 'ACIM' | 'SPONSOR' | 'PARTNER_INSTITUTION' | 'SUPPORTING_COMPANY';
}

export interface ProjectResults {
  participantsCount?: number;
  estimatedReach?: number;
  impactReached?: number;
  satisfactionScore?: number; // 1-10 or 1-5
  satisfactionFeedback?: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  responsible: string; // Name from teamMembers
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface ProjectSponsor {
  id: string;
  name: string;
  contact: string;
  value: number;
  observation: string;
}

export interface Project {
  id: string;
  year: number;
  name: string;
  coordinatorId: string; // References a Member
  coordinatorName: string; // Denormalized for display if needed

  // Dates
  eventDate: string; // ISO Date
  planningStartDate: string;
  planningEndDate: string;

  // Team
  teamMembers: string[]; // List of names or Member IDs

  description: string;

  // Optional / Governance
  targetAudience: TargetAudience[];
  targetAudienceOther?: string;

  status: ProjectStatus;
  type: ProjectType;

  partners: ProjectPartner[];

  // Results (Only if status is appropriate)
  results?: ProjectResults;

  // Plan & Connections
  schedule?: ProjectTask[];
  sponsors?: ProjectSponsor[];

  // Financial
  budgetPlanned?: number;
  budgetReached?: number;

  // Assets
  images?: string[]; // URLs
  files?: Array<{ name: string; url: string }>; // URLs

  // Institutional
  institutionalObservations?: string;
  lessonsLearned?: string;

  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  industry?: string;
  website?: string;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  companyId?: string; // Link to Company
  companyName: string; // Keep for display or legacy
  role: string; // e.g., 'President', 'Counselor', 'Member'
  email: string;
  phone?: string;
  // active: boolean; // Deprecated in favor of status
  status: 'active' | 'inactive';
  admissionYear: number;
  avatarUrl?: string;
  cpf?: string;
  password?: string;
  isAdmin?: boolean;
  exitYear?: number;
}
