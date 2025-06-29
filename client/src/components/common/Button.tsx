import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "edit" | "submit" | "delete";
  className?: string;
}

const variantClasses: Record<string, string> = {
  primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
  secondary: "bg-gray-300 hover:bg-gray-400 text-gray-700",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  edit: "bg-yellow-500 hover:bg-yellow-600 text-white",
  submit: "bg-green-600 hover:bg-green-700 text-white",
  delete: "bg-red-700 hover:bg-red-800 text-white",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  disabled,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`px-4 py-2 rounded font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        variantClasses[variant]
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
