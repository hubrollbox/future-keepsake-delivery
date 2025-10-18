export const BASE_PRICE_EUR = 5;

import type { KeepsakeFormData } from "@/hooks/useKeepsakeForm";

export function getBasePriceEur(formData: KeepsakeFormData): number {
  // Regra freemium: mensagem digital sem extras e canal grátis não paga base
  const extrasTotal = (formData.selected_products || []).reduce((sum, p) => sum + (p.price || 0), 0);
  const channelCost = formData.channel_cost || 0;
  const isDigital = formData.type === 'digital';
  const isFreemium = isDigital && extrasTotal === 0 && channelCost === 0;
  return isFreemium ? 0 : BASE_PRICE_EUR;
}

export function computeTotalSimple(formData: KeepsakeFormData): number {
  const extrasTotal = (formData.selected_products || []).reduce((sum, p) => sum + (p.price || 0), 0);
  const channelCost = formData.channel_cost || 0;
  const base = getBasePriceEur(formData);
  return base + extrasTotal + channelCost;
}

export function computeExtrasTotal(formData: KeepsakeFormData): number {
  return (formData.selected_products || []).reduce((sum, p) => sum + (p.price || 0), 0);
}