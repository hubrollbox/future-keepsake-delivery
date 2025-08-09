declare module '@/integrations/supabase/client' {
  import { SupabaseClient } from '@supabase/supabase-js';
  
  // Exporta o cliente Supabase
  export const supabase: SupabaseClient;
  
  // Tipos básicos para operações do Supabase
  export type SupabaseResponse<T> = {
    data: T | null;
    error: Error | null;
  };
  
  // Tipos para tabelas comuns
  export interface User {
    id: string;
    email: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
  }
  
  export interface Profile {
    id: string;
    user_id: string;
    full_name: string;
    avatar_url: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
  }
  
  export interface Keepsake {
    id: string;
    user_id: string;
    title: string;
    message_content: string;
    message_type: string;
    delivery_date: string;
    status: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
  }
  
  export interface Delivery {
    id: string;
    user_id: string;
    keepsake_id: string;
    recipient_id: string;
    delivery_date: string;
    status: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
  }
  
  export interface Recipient {
    id: string;
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
  }
  
  export interface WarehouseItem {
    id: string;
    product_id: string;
    status: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
  }
  
  export interface Payment {
    id: string;
    user_id: string;
    amount: number;
    status: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
  }
}