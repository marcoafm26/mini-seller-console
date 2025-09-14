import type { ApiError } from '../../interfaces/api/error';
import type {
  Opportunity,
  OpportunityStage,
} from '../../interfaces/opportunity';
import { Button } from '../ui/Button';
import type { TableColumn } from '../ui/Table';
import { Table } from '../ui/Table';
import { formatCurrency, formatDate } from '../utils/formatting';

interface OpportunitiesTableProps {
  opportunities: Opportunity[];
  loading?: boolean;
  error?: ApiError | null;
  onViewOpportunity?: (opportunityId: string) => void;
  onRefresh?: () => void;
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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stageClasses[stage]}`}
    >
      {stage}
    </span>
  );
};

// Table columns definition
const opportunityColumns: TableColumn<Opportunity>[] = [
  {
    key: 'name',
    header: 'Opportunity',
    width: 'w-64',
    render: (opportunity: Opportunity) => (
      <div className="flex flex-col">
        <div className="font-medium text-neutral-900">{opportunity.name}</div>
        <div className="text-sm text-neutral-500">
          {opportunity.accountName}
        </div>
      </div>
    ),
  },
  {
    key: 'stage',
    header: 'Stage',
    width: 'w-40',
    render: (opportunity: Opportunity) => (
      <StageBadge stage={opportunity.stage} />
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    width: 'w-32',
    render: (opportunity: Opportunity) => (
      <div className="text-neutral-900 font-medium">
        {opportunity.amount ? formatCurrency(opportunity.amount) : '—'}
      </div>
    ),
  },
  {
    key: 'createdAt',
    header: 'Created',
    width: 'w-32',
    render: (opportunity: Opportunity) => (
      <span className="text-sm text-neutral-500">
        {formatDate(opportunity.createdAt)}
      </span>
    ),
  },
  {
    key: 'updatedAt',
    header: 'Last Updated',
    width: 'w-32',
    render: (opportunity: Opportunity) => (
      <span className="text-sm text-neutral-500">
        {formatDate(opportunity.updatedAt)}
      </span>
    ),
  },
];

export const OpportunitiesTable = ({
  opportunities,
  loading = false,
  error = null,
  onViewOpportunity,
  onRefresh,
}: OpportunitiesTableProps) => {
  // Show error state
  if (error) {
    return (
      <div className="px-6 py-12 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.928 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-neutral-900">
          Error loading opportunities
        </h3>
        <p className="mt-1 text-sm text-neutral-500">{error.message}</p>
        {onRefresh && (
          <div className="mt-6">
            <Button variant="primary" onClick={onRefresh}>
              Try Again
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Show empty state if no opportunities and not loading
  if (opportunities.length === 0 && !loading) {
    return (
      <div className="px-6 py-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-neutral-900">
          No opportunities yet
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Convert some leads to create your first opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="px-6">
        <p className="text-sm text-neutral-600">
          {loading ? (
            'Loading opportunities...'
          ) : (
            <>
              Showing {opportunities.length} opportunit
              {opportunities.length !== 1 ? 'ies' : 'y'}
            </>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table
          data={opportunities}
          columns={opportunityColumns}
          loading={loading}
          emptyMessage="No opportunities found"
          onRowClick={(opportunity) => onViewOpportunity?.(opportunity.id)}
        />
      </div>

      {/* Refresh Button */}
      {onRefresh && !loading && (
        <div className="px-6 py-4 border-t border-neutral-200">
          <Button variant="ghost" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
};
