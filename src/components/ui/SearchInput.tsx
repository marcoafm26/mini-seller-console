import { useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  className?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SearchInput = ({
  placeholder = 'Search...',
  value,
  onChange,
  onClear,
  className = '',
  label,
  size = 'md',
}: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm pl-9 pr-9',
    md: 'px-4 py-2 text-sm pl-10 pr-10',
    lg: 'px-6 py-3 text-base pl-12 pr-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const iconPositions = {
    sm: 'left-0 pl-2.5',
    md: 'left-0 pl-3',
    lg: 'left-0 pl-4',
  };

  const clearIconPositions = {
    sm: 'right-0 pr-2.5',
    md: 'right-0 pr-3',
    lg: 'right-0 pr-4',
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={`absolute inset-y-0 left-0 flex items-center pointer-events-none ${iconPositions[size]}`}
        >
          <svg
            className={`${iconSizes[size]} text-neutral-400`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            block w-full ${sizeClasses[size]}
            border border-neutral-300 rounded-xl
            bg-white text-neutral-900 placeholder-neutral-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            transition-colors
            ${isFocused ? 'ring-2 ring-primary-500 border-primary-500' : ''}
          `}
        />

        {value && onClear && (
          <button
            onClick={onClear}
            className={`absolute inset-y-0 right-0 flex items-center text-neutral-400 hover:text-neutral-600 ${clearIconPositions[size]}`}
          >
            <svg
              className={`${iconSizes[size]}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
