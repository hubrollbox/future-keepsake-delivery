export const BASE_PRICE_EUR = 5;

import type { KeepsakeFormData } from "@/hooks/useKeepsakeForm";

export function computeTotalSimple(formData: KeepsakeFormData): number {
  const extrasTotal = (formData.selected_products || []).reduce((sum, p) => sum + (p.price || 0), 0);
  const channelCost = formData.channel_cost || 0;
  return BASE_PRICE_EUR + extrasTotal + channelCost;
}

export function computeExtrasTotal(formData: KeepsakeFormData): number {
  return (formData.selected_products || []).reduce((sum, p) => sum + (p.price || 0), 0);
}