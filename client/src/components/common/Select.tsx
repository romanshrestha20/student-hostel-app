import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select: React.FC<SelectProps> = ({ label, error, children, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1 font-semibold text-gray-700">{label}</label>}
      <select
        {...props}
        className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
