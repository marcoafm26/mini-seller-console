import type { Lead } from '../../interfaces/lead';
import { formatDate, getScoreColor } from '../utils/formatting';
import { Badge } from './Badge';

interface LeadCardProps {
  lead: Lead;
  onClick: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick }) => {
  return (
    <div
      className="bg-white p-4 border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(lead)}
    >
      {/* Header - Name and Score */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-neutral-900 truncate">
            {lead.name}
          </h3>
          <p className="text-xs text-neutral-500 truncate">{lead.email}</p>
        </div>
        <div className={`text-lg font-mono ml-3 ${getScoreColor(lead.score)}`}>
          {lead.score}
        </div>
      </div>

      {/* Company and Source */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wide">
            Company
          </p>
          <p className="text-sm text-neutral-900 truncate">{lead.company}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wide">
            Source
          </p>
          <p className="text-sm text-neutral-900 truncate">{lead.source}</p>
        </div>
      </div>

      {/* Status and Created Date */}
      <div className="flex justify-between items-center">
        <Badge status={lead.status} size="sm" />
        <div className="text-xs text-neutral-500">
          {formatDate(lead.createdAt)}
        </div>
      </div>
    </div>
  );
};
