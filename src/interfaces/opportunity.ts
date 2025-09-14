export type OpportunityStage =
  | 'Prospecting'
  | 'Qualification'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

export interface Opportunity {
  id: string;
  name: string;
  stage: OpportunityStage;
  amount?: number; // Optional amount
  accountName: string;
  leadId: string; // Reference to the original lead
  createdAt: string;
  updatedAt: string;
}

export interface CreateOpportunityRequest {
  name: string;
  stage?: OpportunityStage; // Default to 'Prospecting' if not provided
  amount?: number;
  accountName: string;
  leadId: string;
}
