import React from "react";
import { useFormContext } from "react-hook-form";
import { FormFieldContext, FormItemContext } from "@/lib/form-context";

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const form = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;
  const fieldRef = React.useRef<HTMLInputElement>(null);

  const formItemId = `${id}-form-item`;
  const formDescriptionId = `${id}-form-item-description`;
  const formMessageId = `${id}-form-item-message`;

  const fieldState = form?.getFieldState?.(fieldContext.name, form.formState);
  const error = fieldState?.error;

  return {
    id,
    name: fieldContext.name,
    formItemId,
    formDescriptionId,
    formMessageId,
    fieldRef,
    error,
  };
};