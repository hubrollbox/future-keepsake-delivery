
import { Label } from "@/components/ui/label";
import React from "react";

interface RegisterCheckboxFieldProps {
  id: string;
  name: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | undefined;
  required?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  className?: string;
}

const RegisterCheckboxField: React.FC<RegisterCheckboxFieldProps> = ({
  id,
  name,
  label,
  checked,
  onChange,
  error,
  required = false,
  inputRef,
  className = ""
}) => (
  <div className="flex items-center space-x-2 mt-1 min-h-[44px]">
    <input
      id={id}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`h-5 w-5 rounded border border-dusty-rose/30 focus:outline-none focus:ring-2 focus:ring-dusty-rose/40 transition-all duration-200 ${className}`}
      required={required}
      ref={inputRef}
      aria-required={required}
    />
    <Label htmlFor={id}>{label}</Label>
    {error && (
      <span className="text-red-600 text-sm ml-2">{error}</span>
    )}
  </div>
);

export default RegisterCheckboxField;
