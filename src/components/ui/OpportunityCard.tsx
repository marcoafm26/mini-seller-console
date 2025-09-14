import React from 'react';
import type {
  Opportunity,
  OpportunityStage,
} from '../../interfaces/opportunity';
import { formatCurrency, formatDate } from '../utils/formatting';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick: (opportunity: Opportunity) => void;
}

// Stage badge component
const StageBadge: React.FC<{ stage: OpportunityStage }> = ({ stage }) => {
  const stageClasses = {
    Prospecting: 'bg-blue-100 text-blue-700',
    Qualification: 'bg-yellow-100 text-yellow-700',
    Proposal: 'bg-orange-100 text-orange-700',
    Negotiation: 'bg-purple-100 text-purple-700',
    'Closed Won': 'bg-green-100 text-green-700',
    'Closed Lost': 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stageClasses[stage]}`}
    >
      {stage}
    </span>
  );
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onClick,
}) => {
  return (
    <div
      className="bg-white p-4 border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(opportunity)}
    >
      {/* Header - Name and Amount */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-neutral-900 truncate">
            {opportunity.name}
          </h3>
          <p className="text-xs text-neutral-500 truncate">
            {opportunity.accountName}
          </p>
        </div>
        <div className="text-sm font-medium text-neutral-900 ml-3">
          {opportunity.amount ? formatCurrency(opportunity.amount) : '—'}
        </div>
      </div>

      {/* Stage and Dates */}
      <div className="flex justify-between items-center">
        <StageBadge stage={opportunity.stage} />
        <div className="text-xs text-neutral-500">
          {formatDate(opportunity.createdAt)}
        </div>
      </div>
    </div>
  );
};
