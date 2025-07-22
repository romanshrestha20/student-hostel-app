// components/ui/Dropdown.tsx

import React from "react";

interface DropdownProps {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string; // for layout customization
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  className = "",
}) => {
  const id = React.useId();

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
