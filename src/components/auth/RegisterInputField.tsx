import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface RegisterInputFieldProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  className?: string;
}

const RegisterInputField: React.FC<RegisterInputFieldProps> = ({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  inputRef,
  className = "",
}) => (
  <div>
    <Label htmlFor={id} className="text-steel-blue">{label}</Label>
    <Input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border-dusty-rose/30 focus:border-dusty-rose ${error ? "border-red-500" : ""} ${className} h-12 min-h-[44px]`}
      required={required}
      ref={inputRef}
      autoComplete={type === "password" ? "new-password" : undefined}
    />
    {error && (
      <p className="text-red-600 text-sm mt-1">{error}</p>
    )}
  </div>
);

export default RegisterInputField;
