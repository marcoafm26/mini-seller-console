// Lead Management Types

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Lost'
  | 'Converted';

export type LeadSource =
  | 'Website'
  | 'LinkedIn'
  | 'Email Campaign'
  | 'Cold Call'
  | 'Referral'
  | 'Trade Show'
  | 'Social Media'
  | 'Advertisement';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  source: LeadSource;
  score: number;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  search: string;
  status: LeadStatus | 'All';
  dateRange: '1d' | '7d' | '30d' | '1y' | 'All';
  sortBy: 'score' | 'name' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// API Response types
export interface LeadsResponse {
  leads: Lead[];
  total: number;
  hasMore: boolean;
}

// Lead conversion
export interface ConvertLeadInput {
  leadId: string;
  opportunityName: string;
  accountName: string;
  amount?: number; // Optional initial amount
}
