import { useEffect, useRef, useState } from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FilterSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  size = 'md',
  className = '',
}: FilterSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-full bg-white border border-neutral-300 rounded-xl
          text-left text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          transition-colors hover:bg-neutral-50
          ${sizeClasses[size]}
          ${isOpen ? 'ring-2 ring-primary-500 border-primary-500' : ''}
        `}
      >
        <span className="flex items-center justify-between">
          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <svg
            className={`h-5 w-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-strong rounded-xl border border-neutral-200 max-h-60 overflow-auto">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                  ${
                    value === option.value
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-neutral-900 hover:bg-neutral-50'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
