import type { ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  header: string;
  width?: string;
  render: (item: T) => ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export const Table = <T extends { id: string }>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
}: TableProps<T>) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="px-6 py-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="px-6 py-12 text-center">
          <p className="text-neutral-600">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200">
        {/* Header */}
        <thead className="bg-neutral-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider ${column.width || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-white divide-y divide-neutral-200">
          {data.map((item) => (
            <tr
              key={item.id}
              className={`hover:bg-neutral-50 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
