import { useLeadsData } from '../../hooks/useLeadsData.ts';
import type { Lead, LeadStatus } from '../../interfaces/lead';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button.tsx';
import { FilterSelect } from '../ui/FilterSelect.tsx';
import { Pagination } from '../ui/Pagination.tsx';
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

const statusOptions = [
  { value: 'All', label: 'All' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const dateRangeOptions = [
  { value: '1d', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '1y', label: 'Last 1 year' },
  { value: 'All', label: 'All' },
];

const sortByOptions = [
  { value: 'score', label: 'Score' },
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Created' },
  { value: 'updatedAt', label: 'Updated' },
];

const sortOrderOptions = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

export const LeadsTable = ({ onViewLead }: LeadsTableProps) => {
  const {
    leads,
    loading,
    error,
    filters,
    pagination,
    // debouncedFilters,
    updateFilters,
    clearFilters,
    changePage,
    // nextPage,
    // prevPage,
    // updateLead,
    // refetch,
    isEmpty,
    // hasData,
  } = useLeadsData();
  return (
    <>
      <div className="flex flex-2 items-end gap-4 mb-4 mx-4">
        <div className="flex-2">
          <SearchInput
            label="Search"
            value={filters.search}
            onChange={(search) => updateFilters({ search })}
            onClear={() => updateFilters({ search: '' })}
          />
        </div>
        <div className="flex-1">
          <FilterSelect
            options={statusOptions}
            label="Status"
            value={filters.status}
            onChange={(status) =>
              updateFilters({ status: status as LeadStatus })
            }
          />
        </div>
        <div className="flex-1">
          <FilterSelect
            options={dateRangeOptions}
            label="Date Range"
            value={filters.dateRange}
            onChange={(dateRange) =>
              updateFilters({
                dateRange: dateRange as '1d' | '7d' | '30d' | '1y' | 'All',
              })
            }
          />
        </div>
        <div className="flex-1">
          <FilterSelect
            options={sortByOptions}
            label="Sort By"
            value={filters.sortBy}
            onChange={(sortBy) =>
              updateFilters({
                sortBy: sortBy as 'score' | 'name' | 'createdAt' | 'updatedAt',
              })
            }
          />
        </div>
        <div className="flex-1">
          <FilterSelect
            options={sortOrderOptions}
            label="Sort Order"
            value={filters.sortOrder}
            onChange={(sortOrder) =>
              updateFilters({
                sortOrder: sortOrder as 'asc' | 'desc',
              })
            }
          />
        </div>
        <div className="flex-1">
          <Button size="md" onClick={() => clearFilters()}>
            Clear Filters
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <Table
          data={leads}
          columns={leadColumns}
          loading={loading}
          emptyMessage={isEmpty ? 'No leads found' : error?.message}
          onRowClick={(lead) => onViewLead?.(lead.id)}
        />
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          onPageChange={changePage}
        />
      </div>
    </>
  );
};
