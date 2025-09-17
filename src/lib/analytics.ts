// Google Analytics service for tracking events and conversions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export interface ConversionEvent {
  transaction_id: string;
  value: number;
  currency: string;
  items?: {
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }[];
}

class AnalyticsService {
  private isEnabled: boolean = false;
  private measurementId: string = 'G-E18CGKVX8K';

  constructor() {
    // Check if gtag is available
    this.isEnabled = typeof window !== 'undefined' && typeof window.gtag === 'function';
    this.initGA();
  }

  private initGA() {
    // Evita múltiplas inclusões
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };

    window.gtag("js", new Date());
    window.gtag("config", this.measurementId);
    this.isEnabled = true;
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isEnabled) return;

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }

  // Track page views
  trackPageView(page_title: string, page_location: string): void {
    if (!this.isEnabled) return;

    window.gtag('config', this.measurementId, {
      page_title,
      page_location,
    });
  }

  // Track conversions (purchases, subscriptions)
  trackConversion(event: ConversionEvent): void {
    if (!this.isEnabled) return;

    window.gtag('event', 'purchase', {
      transaction_id: event.transaction_id,
      value: event.value,
      currency: event.currency,
      items: event.items,
    });
  }

  // Track user registration
  trackSignUp(method: string = 'email'): void {
    this.trackEvent({
      action: 'sign_up',
      category: 'engagement',
      label: method,
    });
  }

  // Track login
  trackLogin(method: string = 'email'): void {
    this.trackEvent({
      action: 'login',
      category: 'engagement',
      label: method,
    });
  }

  // Track keepsake creation
  trackKeepsakeCreation(type: string): void {
    this.trackEvent({
      action: 'create_keepsake',
      category: 'keepsake',
      label: type,
    });
  }

  // Track delivery scheduling
  trackDeliveryScheduled(delivery_type: string): void {
    this.trackEvent({
      action: 'schedule_delivery',
      category: 'delivery',
      label: delivery_type,
    });
  }

  // Track subscription events
  trackSubscription(plan: string, action: 'subscribe' | 'upgrade' | 'cancel'): void {
    this.trackEvent({
      action: `subscription_${action}`,
      category: 'subscription',
      label: plan,
    });
  }

  // Track AI feature usage
  trackAIUsage(feature: string): void {
    this.trackEvent({
      action: 'ai_feature_used',
      category: 'ai',
      label: feature,
    });
  }

  // Track form submissions
  trackFormSubmission(form_name: string): void {
    this.trackEvent({
      action: 'form_submit',
      category: 'engagement',
      label: form_name,
    });
  }

  // Track button clicks
  trackButtonClick(button_name: string, location: string): void {
    this.trackEvent({
      action: 'button_click',
      category: 'engagement',
      label: `${button_name}_${location}`,
    });
  }

  // Track search usage
  trackSearch(search_term: string): void {
    this.trackEvent({
      action: 'search',
      category: 'engagement',
      label: search_term,
    });
  }

  // Track errors
  trackError(error_message: string, error_location: string): void {
    this.trackEvent({
      action: 'error',
      category: 'error',
      label: `${error_location}: ${error_message}`,
    });
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Export initGA function for manual initialization
export const initGA = () => {
  return analytics;
};

// Convenience functions for common tracking
export const trackPageView = (title: string, location: string) => 
  analytics.trackPageView(title, location);

export const trackEvent = (event: AnalyticsEvent) => 
  analytics.trackEvent(event);

export const trackConversion = (event: ConversionEvent) => 
  analytics.trackConversion(event);

export const trackSignUp = (method?: string) => 
  analytics.trackSignUp(method);

export const trackLogin = (method?: string) => 
  analytics.trackLogin(method);

export const trackKeepsakeCreation = (type: string) => 
  analytics.trackKeepsakeCreation(type);

export const trackDeliveryScheduled = (type: string) => 
  analytics.trackDeliveryScheduled(type);

export const trackSubscription = (plan: string, action: 'subscribe' | 'upgrade' | 'cancel') => 
  analytics.trackSubscription(plan, action);

export const trackAIUsage = (feature: string) => 
  analytics.trackAIUsage(feature);

export const trackFormSubmission = (formName: string) => 
  analytics.trackFormSubmission(formName);

export const trackButtonClick = (buttonName: string, location: string) => 
  analytics.trackButtonClick(buttonName, location);

export const trackSearch = (searchTerm: string) => 
  analytics.trackSearch(searchTerm);

export const trackError = (errorMessage: string, errorLocation: string) => 
  analytics.trackError(errorMessage, errorLocation);
