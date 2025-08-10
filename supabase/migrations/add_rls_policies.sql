-- Melhoria 5: Row Level Security
ALTER TABLE keepsakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipients ENABLE ROW LEVEL SECURITY;

-- Política para keepsakes
CREATE POLICY "Users can only see their own keepsakes" ON keepsakes
  FOR ALL USING (auth.uid() = user_id);

-- Política para recipients
CREATE POLICY "Users can only see their own recipients" ON recipients
  FOR ALL USING (auth.uid() = user_id);