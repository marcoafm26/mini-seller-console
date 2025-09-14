import type { ApiError } from '../../interfaces/api/error';
import type { Lead, LeadStatus } from '../../interfaces/lead';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FilterSelect } from '../ui/FilterSelect';
import { LeadCard } from '../ui/LeadCard';
import { Pagination } from '../ui/Pagination';
import { SearchInput } from '../ui/SearchInput';
import type { TableColumn } from '../ui/Table';
import { Table } from '../ui/Table';
import { formatDate, getScoreColor } from '../utils/formatting';

// Filter options
const statusOptions = [
  { value: 'All', label: 'All' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
  { value: 'Converted', label: 'Converted' },
];

const dateRangeOptions = [
  { value: 'All', label: 'All Time' },
  { value: '1d', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '1y', label: 'Last year' },
];

const sortByOptions = [
  { value: 'score', label: 'Score' },
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' },
];

const sortOrderOptions = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

// Interface for props
interface UserFilters {
  search: string;
  status: LeadStatus | 'All';
  dateRange: '1d' | '7d' | '30d' | '1y' | 'All';
  sortBy: 'score' | 'name' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface LeadsTableProps {
  leads: Lead[];
  loading?: boolean;
  error?: ApiError | null;
  filters: UserFilters;
  updateFilters: (filters: Partial<UserFilters>) => void;
  clearFilters: () => void;
  pagination: PaginationState;
  changePage: (page: number) => void;
  isEmpty: boolean;
  onViewLead?: (leadId: string) => void;
}

// Table columns definition
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
  filters,
  updateFilters,
  clearFilters,
  pagination,
  changePage,
  isEmpty,
  onViewLead,
}: LeadsTableProps) => {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="px-4 sm:px-6 py-4 space-y-4">
        {/* Search - Full width on all screen sizes */}
        <div className="w-full">
          <SearchInput
            label="Search Leads"
            value={filters.search}
            onChange={(search) => updateFilters({ search })}
            onClear={() => updateFilters({ search: '' })}
            placeholder="Search by name, email, or company..."
          />
        </div>

        {/* Filter Controls - Grid layout for mobile responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div className="sm:col-span-1">
            <FilterSelect
              options={statusOptions}
              label="Status"
              value={filters.status}
              onChange={(status) =>
                updateFilters({ status: status as LeadStatus | 'All' })
              }
            />
          </div>

          <div className="sm:col-span-1">
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

          <div className="sm:col-span-1 lg:col-span-1">
            <FilterSelect
              options={sortByOptions}
              label="Sort By"
              value={filters.sortBy}
              onChange={(sortBy) =>
                updateFilters({
                  sortBy: sortBy as
                    | 'score'
                    | 'name'
                    | 'createdAt'
                    | 'updatedAt',
                })
              }
            />
          </div>

          <div className="sm:col-span-1 lg:col-span-1">
            <FilterSelect
              options={sortOrderOptions}
              label="Order"
              value={filters.sortOrder}
              onChange={(sortOrder) =>
                updateFilters({
                  sortOrder: sortOrder as 'asc' | 'desc',
                })
              }
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 xl:col-span-1 flex justify-start xl:justify-end items-end">
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-10 w-full sm:w-auto"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results summary */}
      <div className="px-4 sm:px-6">
        <p className="text-xs sm:text-sm text-neutral-600">
          {loading ? (
            'Loading leads...'
          ) : pagination.total === 0 ? (
            <>
              No leads found
              {(filters.search ||
                filters.status !== 'All' ||
                filters.dateRange !== 'All') &&
                ' with current filters'}
            </>
          ) : (
            <>
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{' '}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.total
              )}{' '}
              of {pagination.total} lead{pagination.total !== 1 ? 's' : ''}
              {(filters.search ||
                filters.status !== 'All' ||
                filters.dateRange !== 'All') &&
                ' (filtered)'}
            </>
          )}
        </p>
      </div>

      {isEmpty && !loading ? (
        <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
          <svg
            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-neutral-900">
            No leads found
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Try adjusting your filters or create your first lead.
          </p>
          <div className="mt-4 sm:mt-6">
            <Button variant="primary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-hidden">
            <Table
              data={leads}
              columns={leadColumns}
              loading={loading}
              emptyMessage="No leads found with the current filters"
              onRowClick={(lead) => onViewLead?.(lead.id)}
            />
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden px-4 space-y-3">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={(lead) => onViewLead?.(lead.id)}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="border-t border-neutral-200">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                onPageChange={changePage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
