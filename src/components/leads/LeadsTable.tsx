import { useLeadFilters } from '../../hooks/useLeadFilters.ts';
import type { Lead } from '../../interfaces/lead';
import { Badge } from '../ui/Badge';
import { SearchInput } from '../ui/SearchInput.tsx';
import type { TableColumn } from '../ui/Table.tsx';
import { Table } from '../ui/Table.tsx';
import { formatDate, getScoreColor } from '../utils/formatting';

interface LeadsTableProps {
  leads: Lead[];
  loading?: boolean;
  onViewLead?: (leadId: string) => void;
  //   onConvertLead?: (leadId: string) => void;
}

const leadColumns: TableColumn<Lead>[] = [
  {
    key: 'name',
    header: 'Lead',
    width: 'w-64',
    render: (lead: Lead) => (
      <div className="flex flex-col">
        <div className="font-medium text-neutral-900">{lead.name}</div>
        <div className="text-sm text-neutral-500">{lead.email}</div>
      </div>
    ),
  },
  {
    key: 'company',
    header: 'Company',
    width: 'w-48',
    render: (lead: Lead) => (
      <div className="text-neutral-900">{lead.company}</div>
    ),
  },
  {
    key: 'source',
    header: 'Source',
    width: 'w-32',
    render: (lead: Lead) => (
      <span className="text-sm text-neutral-600">{lead.source}</span>
    ),
  },
  {
    key: 'score',
    header: 'Score',
    width: 'w-24',
    render: (lead: Lead) => (
      <span className={`text-lg font-mono ${getScoreColor(lead.score)}`}>
        {lead.score}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    width: 'w-32',
    render: (lead: Lead) => <Badge status={lead.status} size="sm" />,
  },
  {
    key: 'createdAt',
    header: 'Created',
    width: 'w-32',
    render: (lead: Lead) => (
      <span className="text-sm text-neutral-500">
        {formatDate(lead.createdAt)}
      </span>
    ),
  },
];

export const LeadsTable = ({
  leads,
  loading = false,
  onViewLead,
}: LeadsTableProps) => {
  console.log('leads table');
  const { filters, filteredLeads, clearFilters, setFilters } =
    useLeadFilters(leads);

  return (
    <>
      <div className="mb-4 mx-4">
        <SearchInput
          value={filters.search}
          onChange={(search) => setFilters({ ...filters, search })}
          onClear={() => clearFilters()}
        />
      </div>
      <Table
        data={filteredLeads}
        columns={leadColumns}
        loading={loading}
        emptyMessage="No leads found"
        onRowClick={(lead) => onViewLead?.(lead.id)}
      />
    </>
  );
};
