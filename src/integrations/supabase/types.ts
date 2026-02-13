export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: number
          points: number
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id?: number
          points: number
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: number
          points?: number
          title?: string
        }
        Relationships: []
      }
      admin_roles: {
        Row: {
          created_at: string | null
          id: string
          permissions: Json | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permissions?: Json | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permissions?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      api_rate_limits: {
        Row: {
          client_ip: unknown
          created_at: string | null
          endpoint: string
          id: string
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          client_ip: unknown
          created_at?: string | null
          endpoint: string
          id?: string
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          client_ip?: unknown
          created_at?: string | null
          endpoint?: string
          id?: string
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      api_request_log: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          ip_address: unknown
          request_count: number | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address?: unknown
          request_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: unknown
          request_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          created_at: string | null
          date: string
          huggingface_requests: number | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          huggingface_requests?: number | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          huggingface_requests?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          payment_id: string | null
          product_id: string
          product_price: number
          product_title: string
          quantity: number
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          payment_id?: string | null
          product_id: string
          product_price: number
          product_title: string
          quantity?: number
          total_amount?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          payment_id?: string | null
          product_id?: string
          product_price?: number
          product_title?: string
          quantity?: number
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      deliveries: {
        Row: {
          created_at: string | null
          delivery_date: string
          description: string | null
          digital_file_url: string | null
          id: string
          keepsake_id: string | null
          keepsake_product_id: string | null
          location: string | null
          payment_status: string | null
          recipient_id: string | null
          status: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
          warehouse_item_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_date: string
          description?: string | null
          digital_file_url?: string | null
          id?: string
          keepsake_id?: string | null
          keepsake_product_id?: string | null
          location?: string | null
          payment_status?: string | null
          recipient_id?: string | null
          status?: string
          title: string
          type?: string
          updated_at?: string | null
          user_id: string
          warehouse_item_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_date?: string
          description?: string | null
          digital_file_url?: string | null
          id?: string
          keepsake_id?: string | null
          keepsake_product_id?: string | null
          location?: string | null
          payment_status?: string | null
          recipient_id?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
          warehouse_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_keepsake_id_fkey"
            columns: ["keepsake_id"]
            isOneToOne: false
            referencedRelation: "keepsakes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_keepsake_product_id_fkey"
            columns: ["keepsake_product_id"]
            isOneToOne: false
            referencedRelation: "keepsake_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_warehouse_item_id_fkey"
            columns: ["warehouse_item_id"]
            isOneToOne: false
            referencedRelation: "warehouse_items"
            referencedColumns: ["id"]
          },
        ]
      }
      extras: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      keepsake_extras: {
        Row: {
          created_at: string | null
          extra_id: string | null
          id: string
          keepsake_id: string | null
          quantity: number | null
        }
        Insert: {
          created_at?: string | null
          extra_id?: string | null
          id?: string
          keepsake_id?: string | null
          quantity?: number | null
        }
        Update: {
          created_at?: string | null
          extra_id?: string | null
          id?: string
          keepsake_id?: string | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "keepsake_extras_extra_id_fkey"
            columns: ["extra_id"]
            isOneToOne: false
            referencedRelation: "extras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "keepsake_extras_keepsake_id_fkey"
            columns: ["keepsake_id"]
            isOneToOne: false
            referencedRelation: "keepsakes"
            referencedColumns: ["id"]
          },
        ]
      }
      keepsake_products: {
        Row: {
          created_at: string | null
          id: string
          keepsake_id: string
          product_id: string
          quantity: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          keepsake_id: string
          product_id: string
          quantity?: number | null
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          keepsake_id?: string
          product_id?: string
          quantity?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "keepsake_products_keepsake_id_fkey"
            columns: ["keepsake_id"]
            isOneToOne: false
            referencedRelation: "keepsakes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "keepsake_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      keepsakes: {
        Row: {
          created_at: string | null
          delivery_date: string
          id: string
          is_public: boolean | null
          message: string
          message_content: string | null
          message_type: string
          payment_status: string | null
          sent_at: string | null
          status: string | null
          title: string
          total_cost: number | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          delivery_date: string
          id?: string
          is_public?: boolean | null
          message: string
          message_content?: string | null
          message_type?: string
          payment_status?: string | null
          sent_at?: string | null
          status?: string | null
          title: string
          total_cost?: number | null
          type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          delivery_date?: string
          id?: string
          is_public?: boolean | null
          message?: string
          message_content?: string | null
          message_type?: string
          payment_status?: string | null
          sent_at?: string | null
          status?: string | null
          title?: string
          total_cost?: number | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          keepsake_id: string | null
          read_at: string | null
          status: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          keepsake_id?: string | null
          read_at?: string | null
          status?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          keepsake_id?: string | null
          read_at?: string | null
          status?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_keepsake_id_fkey"
            columns: ["keepsake_id"]
            isOneToOne: false
            referencedRelation: "keepsakes"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          status: string
          stripe_invoice_id: string
          stripe_subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          status: string
          stripe_invoice_id: string
          stripe_subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          status?: string
          stripe_invoice_id?: string
          stripe_subscription_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          external_reference: string | null
          id: string
          keepsake_id: string | null
          payment_method: string | null
          status: string
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          external_reference?: string | null
          id?: string
          keepsake_id?: string | null
          payment_method?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          external_reference?: string | null
          id?: string
          keepsake_id?: string | null
          payment_method?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_keepsake_id_fkey"
            columns: ["keepsake_id"]
            isOneToOne: false
            referencedRelation: "keepsakes"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          features: string[]
          id: string
          keepsake_limit: string | null
          limitations: string[]
          name: string
          popular: boolean
          price_monthly: number
          price_yearly: number
          subscriber_count: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          features?: string[]
          id?: string
          keepsake_limit?: string | null
          limitations?: string[]
          name: string
          popular?: boolean
          price_monthly?: number
          price_yearly?: number
          subscriber_count?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          features?: string[]
          id?: string
          keepsake_limit?: string | null
          limitations?: string[]
          name?: string
          popular?: boolean
          price_monthly?: number
          price_yearly?: number
          subscriber_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      point_events: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          points: number
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          points: number
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_events_action_type_fkey"
            columns: ["action_type"]
            isOneToOne: false
            referencedRelation: "point_rules"
            referencedColumns: ["action_type"]
          },
        ]
      }
      point_rules: {
        Row: {
          action_type: string
          created_at: string | null
          daily_limit: number | null
          description: string | null
          is_active: boolean | null
          min_interval_seconds: number | null
          points: number
        }
        Insert: {
          action_type: string
          created_at?: string | null
          daily_limit?: number | null
          description?: string | null
          is_active?: boolean | null
          min_interval_seconds?: number | null
          points: number
        }
        Update: {
          action_type?: string
          created_at?: string | null
          daily_limit?: number | null
          description?: string | null
          is_active?: boolean | null
          min_interval_seconds?: number | null
          points?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          poetry: string | null
          price: number
          stock: number
          type: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          poetry?: string | null
          price: number
          stock?: number
          type: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          poetry?: string | null
          price?: number
          stock?: number
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bonus_keepsakes: number
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          level: number | null
          plan_id: string | null
          stripe_customer_id: string | null
          subscription_plan: string | null
          subscription_status: string | null
          total_points: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bonus_keepsakes?: number
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          level?: number | null
          plan_id?: string | null
          stripe_customer_id?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          total_points?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bonus_keepsakes?: number
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          level?: number | null
          plan_id?: string | null
          stripe_customer_id?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          total_points?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      quests: {
        Row: {
          created_at: string | null
          description: string
          id: number
          reward: number
          target: number
          time_limit: unknown
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: number
          reward: number
          target: number
          time_limit?: unknown
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: number
          reward?: number
          target?: number
          time_limit?: unknown
          title?: string
        }
        Relationships: []
      }
      rate_limit_tracking: {
        Row: {
          client_ip: unknown
          created_at: string | null
          endpoint: string
          id: string
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          client_ip: unknown
          created_at?: string | null
          endpoint: string
          id?: string
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          client_ip?: unknown
          created_at?: string | null
          endpoint?: string
          id?: string
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      recipients: {
        Row: {
          channel_cost: number | null
          city: string | null
          country: string | null
          delivery_channel: string
          email: string
          id: string
          keepsake_id: string
          name: string
          phone: string | null
          postal_code: string | null
          relationship: string | null
          state: string | null
          street: string | null
        }
        Insert: {
          channel_cost?: number | null
          city?: string | null
          country?: string | null
          delivery_channel: string
          email: string
          id?: string
          keepsake_id: string
          name: string
          phone?: string | null
          postal_code?: string | null
          relationship?: string | null
          state?: string | null
          street?: string | null
        }
        Update: {
          channel_cost?: number | null
          city?: string | null
          country?: string | null
          delivery_channel?: string
          email?: string
          id?: string
          keepsake_id?: string
          name?: string
          phone?: string | null
          postal_code?: string | null
          relationship?: string | null
          state?: string | null
          street?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipients_keepsake_id_fkey"
            columns: ["keepsake_id"]
            isOneToOne: false
            referencedRelation: "keepsakes"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_notifications: {
        Row: {
          delivery_date: string
          delivery_id: string | null
          id: string
          keepsake_id: string | null
          recipient_id: string | null
          sent_at: string | null
          status: string | null
          user_email: string
          user_id: string
        }
        Insert: {
          delivery_date: string
          delivery_id?: string | null
          id?: string
          keepsake_id?: string | null
          recipient_id?: string | null
          sent_at?: string | null
          status?: string | null
          user_email: string
          user_id: string
        }
        Update: {
          delivery_date?: string
          delivery_id?: string | null
          id?: string
          keepsake_id?: string | null
          recipient_id?: string | null
          sent_at?: string | null
          status?: string | null
          user_email?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_notifications_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_notifications_keepsake_id_fkey"
            columns: ["keepsake_id"]
            isOneToOne: false
            referencedRelation: "keepsakes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          error_message: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          ends_at: string | null
          id: string
          plan_id: string | null
          started_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          ends_at?: string | null
          id?: string
          plan_id?: string | null
          started_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          ends_at?: string | null
          id?: string
          plan_id?: string | null
          started_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: number | null
          id: number
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_id?: number | null
          id?: number
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_id?: number | null
          id?: number
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quests: {
        Row: {
          completed_at: string | null
          id: number
          progress: number | null
          quest_id: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: number
          progress?: number | null
          quest_id?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: number
          progress?: number | null
          quest_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_quests_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown
          last_accessed: string | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown
          last_accessed?: string | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown
          last_accessed?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string | null
          current_level: number | null
          current_streak: number | null
          last_activity_date: string | null
          longest_streak: number | null
          milestones: Json | null
          total_points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_level?: number | null
          current_streak?: number | null
          last_activity_date?: string | null
          longest_streak?: number | null
          milestones?: Json | null
          total_points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_level?: number | null
          current_streak?: number | null
          last_activity_date?: string | null
          longest_streak?: number | null
          milestones?: Json | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      warehouse_items: {
        Row: {
          client_name: string
          created_at: string | null
          id: string
          keepsake_id: string | null
          photo_url: string | null
          product_description: string
          product_id: string | null
          received_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          client_name: string
          created_at?: string | null
          id?: string
          keepsake_id?: string | null
          photo_url?: string | null
          product_description: string
          product_id?: string | null
          received_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          client_name?: string
          created_at?: string | null
          id?: string
          keepsake_id?: string | null
          photo_url?: string | null
          product_description?: string
          product_id?: string | null
          received_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_items_keepsake_id_fkey"
            columns: ["keepsake_id"]
            isOneToOne: false
            referencedRelation: "keepsakes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_bonus_keepsakes: {
        Args: { p_bonus_amount: number; p_user_id: string }
        Returns: Json
      }
      add_points: {
        Args: { p_action_type: string; p_metadata?: Json; p_user_id: string }
        Returns: Json
      }
      admin_get_deliveries: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          created_at: string
          delivery_date: string
          description: string
          digital_file_url: string
          id: string
          keepsake_id: string
          location: string
          payment_status: string
          recipient_id: string
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }[]
      }
      admin_get_keepsakes: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          created_at: string
          delivery_date: string
          id: string
          is_public: boolean
          message: string
          message_content: string
          message_type: string
          payment_status: string
          sent_at: string
          status: string
          title: string
          total_cost: number
          type: string
          updated_at: string
          user_id: string
        }[]
      }
      admin_get_messages_count: {
        Args: never
        Returns: {
          total_messages: number
        }[]
      }
      calculate_level:
        | { Args: never; Returns: number }
        | { Args: { points: number }; Returns: number }
      deliveries_by_month: {
        Args: never
        Returns: {
          count: number
          month: string
        }[]
      }
      get_current_user_role: { Args: never; Returns: string }
      get_recipient_stats_secure: {
        Args: never
        Returns: {
          recent_recipients: number
          total_recipients: number
        }[]
      }
      handle_gamification_action: {
        Args: { p_action_type: string; p_metadata?: Json; p_user_id: string }
        Returns: Json
      }
      is_admin_secure: { Args: never; Returns: boolean }
      log_security_event: {
        Args: {
          p_action: string
          p_error_message?: string
          p_ip_address?: unknown
          p_metadata?: Json
          p_resource_id?: string
          p_resource_type?: string
          p_success?: boolean
          p_user_agent?: string
          p_user_id: string
        }
        Returns: undefined
      }
      process_due_keepsakes: { Args: never; Returns: undefined }
      send_due_deliveries: { Args: never; Returns: undefined }
      send_due_keepsakes: { Args: never; Returns: undefined }
      send_due_notifications_job: { Args: never; Returns: undefined }
      validate_checkout_session: {
        Args: { p_user_id: string }
        Returns: {
          product_id: string
          product_title: string
          quantity: number
          total_price: number
          unit_price: number
          valid: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
