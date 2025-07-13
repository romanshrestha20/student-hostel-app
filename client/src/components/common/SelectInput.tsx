// components/common/SelectInput.tsx
import React from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  label: string;
  options: Option[];
  error?: string;
  registration: UseFormRegisterReturn;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  error,
  registration,
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        {...registration}
        className={`block w-full p-2 border rounded ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="mt-1 text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};

export default SelectInput;
