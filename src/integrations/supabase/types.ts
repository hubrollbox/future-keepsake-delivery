export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          created_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          status: string;
          created_at: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string;
          points: number;
          created_at: string;
        };
      };
      deliveries: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          delivery_date: string;
          status: string;
          type: string;
          recipient_email: string | null;
          recipient_name: string | null;
          delivery_address: string | null;
          message: string | null;
          created_at: string;
          user_id: string;
        };
      };
      user_achievements: {
        id: string;
        user_id: string;
        achievement_id: string;
        unlocked_at: string | null;
      };
      quests: {
        id: string;
        title: string;
        description: string;
        target: number;
        reward: number;
        time_limit: string | null;
        created_at: string;
      };
      user_quests: {
        id: string;
        user_id: string;
        quest_id: string;
        progress: number;
        completed_at: string | null;
      };
      user_stats: {
        user_id: string;
        total_points: number;
        level: number;
        updated_at: string;
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string | null;
        };
      };
    };
  };
};