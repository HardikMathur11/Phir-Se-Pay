import React from 'react';

interface DataRow {
  key: string;
  value: React.ReactNode;
  copyable?: boolean;
}

interface DataTableProps {
  rows: DataRow[];
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({ rows, className = '' }) => {
  return (
    <div className={`w-full rounded-[var(--radius-tile)] border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface-sunken)] ${className}`}>
      <table className="w-full text-left font-data text-xs">
        <tbody className="divide-y divide-[var(--color-border)]">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-[var(--color-surface)]/50 transition-colors">
              <td className="py-2.5 px-3.5 text-[var(--color-ink-secondary)] w-1/3 font-medium text-[11px]">
                {r.key}
              </td>
              <td className="py-2.5 px-3.5 text-[var(--color-ink)] font-semibold break-all text-[11px]">
                {r.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
