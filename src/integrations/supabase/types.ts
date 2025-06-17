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
};