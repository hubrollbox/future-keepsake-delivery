export type Database = {
  users: {
    id: string;
    name: string;
    email: string;
    created_at: string;
  };
  orders: {
    id: string;
    user_id: string;
    product_id: string;
    status: string;
    created_at: string;
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    points: number;
    created_at: string;
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
};