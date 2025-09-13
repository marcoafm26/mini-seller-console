import type { LeadStatus } from '../../interfaces/lead';

interface BadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const statusClasses = {
    New: 'bg-primary-100 text-primary-700',
    Contacted: 'bg-secondary-100 text-secondary-700',
    Qualified: 'bg-success-100 text-success-700',
    Lost: 'bg-neutral-200 text-neutral-700',
    Converted: 'bg-success-100 text-success-700',
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${statusClasses[status]} ${className}`}
    >
      {status}
    </span>
  );
};
