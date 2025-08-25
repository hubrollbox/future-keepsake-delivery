import React from "react";
import { FormFieldContext, FormItemContext } from "@/lib/form-context";

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);

  const { id } = itemContext;
  const fieldRef = React.useRef<HTMLInputElement>(null);

  const formItemId = `${id}-form-item`;
  const formDescriptionId = `${id}-form-item-description`;
  const formMessageId = `${id}-form-item-message`;

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  return {
    id,
    name: fieldContext.name,
    formItemId,
    formDescriptionId,
    formMessageId,
    fieldRef,
  };
};