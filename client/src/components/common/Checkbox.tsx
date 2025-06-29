import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, error, ...props }) => {
  return (
    <div className="flex items-center mb-4 space-x-2">
      <input
        type="checkbox"
        {...props}
        className={`rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${
          error ? "border-red-500" : ""
        }`}
      />
      {label && <label className="font-semibold text-gray-700">{label}</label>}
      {error && <p className="mt-1 ml-8 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Checkbox;
