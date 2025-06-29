import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string; // accept custom classes
}

const TextInput: React.FC<TextInputProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1 font-semibold text-gray-700">{label}</label>}
      <input
        {...props}
        className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`} // merge custom classes here
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TextInput;
