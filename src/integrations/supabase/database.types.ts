export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      plans: {
        Row: {
          id: string;
          name: string;
          description?: string;
          price_monthly: number;
          price_yearly: number;
          features: string[];
          limitations: string[];
          keepsakeLimit: string;
          popular: boolean;
          active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          price_monthly: number;
          price_yearly: number;
          features: string[];
          limitations: string[];
          keepsakeLimit: string;
          popular: boolean;
          active: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price_monthly?: number;
          price_yearly?: number;
          features?: string[];
          limitations?: string[];
          keepsakeLimit?: string;
          popular?: boolean;
          active?: boolean;
        };
        Relationships: [];
      };
      api_usage: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          huggingface_requests: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          huggingface_requests?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          huggingface_requests?: number;
        };
        Relationships: [];
      };
      deliveries: {
        Row: {
          id: string;
          [key: string]: Json; // Usando Json para outras propriedades desconhecidas
        };
        Insert: {
          id?: string;
          [key: string]: Json;
        };
        Update: {
          id?: string;
          [key: string]: Json;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          content: string;
          type: string;
          read_at: string | null;
          created_at: string;
          user_id: string;
          status: string;
          keepsake_id: string | null;
          message: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          type: string;
          read_at?: string | null;
          created_at?: string;
          user_id: string;
          status: string;
          keepsake_id?: string | null;
          message: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          type?: string;
          read_at?: string | null;
          created_at?: string;
          user_id?: string;
          status?: string;
          keepsake_id?: string | null;
          message?: string;
        };
        Relationships: [];
      };
      achievements: {
        Row: {
          id: number;
          title: string;
          description: string;
          icon: string;
          points: number;
          unlocked: boolean;
          name: string;
          reward: number;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description: string;
          icon: string;
          points: number;
          unlocked?: boolean;
          name: string;
          reward: number;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          icon?: string;
          points?: number;
          unlocked?: boolean;
          name?: string;
          reward?: number;
          category?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      quests: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: string;
          reward: number;
          target: number;
          reward_points: number;
          target_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          type: string;
          reward: number;
          target: number;
          reward_points: number;
          target_value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          type?: string;
          reward?: number;
          target?: number;
          reward_points?: number;
          target_value?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      keepsakes: {
        Row: {
          id: string;
          title: string;
          delivery_date: string;
          status: string;
          type: string;
          message_content: string;
          recipient_email?: string;
          recipient_phone?: string;
          sent_at?: string;
        };
        Insert: {
          id?: string;
          title: string;
          delivery_date: string;
          status: string;
          type: string;
          message_content: string;
          recipient_email?: string;
          recipient_phone?: string;
          sent_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          delivery_date?: string;
          status?: string;
          type?: string;
          message_content?: string;
          recipient_email?: string;
          recipient_phone?: string;
          sent_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          type: string;
          price: number;
          description: string;
          icon: string | null;
          active: boolean;
          created_at: string;
          stock: number;
          category: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          price: number;
          description: string;
          icon?: string | null;
          active?: boolean;
          created_at?: string;
          stock?: number;
          category?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          price?: number;
          description?: string;
          icon?: string | null;
          active?: boolean;
          created_at?: string;
          stock?: number;
          category?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey",
            columns: ["id"],
            isOneToOne: false,
            referencedRelation: "subscriptions",
            referencedColumns: ["user_id"],
          },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_type: 'free' | 'premium' | 'family';
          status: string;
          current_period_end: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_type: 'free' | 'premium' | 'family';
          status: string;
          current_period_end: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_type?: 'free' | 'premium' | 'family';
          status?: string;
          current_period_end?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database['public'];

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row'];
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T];