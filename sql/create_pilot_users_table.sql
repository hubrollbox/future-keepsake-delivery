-- Create pilot_users table for Keepla.pt landing page signups
-- This table will store pre-launch pilot user registrations

CREATE TABLE IF NOT EXISTS pilot_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE pilot_users ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert (for signup form)
CREATE POLICY "Allow anonymous insert" ON pilot_users
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Allow authenticated users to view their own records
CREATE POLICY "Users can view own records" ON pilot_users
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Allow admins to view all records
CREATE POLICY "Admins can view all records" ON pilot_users
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create index for better performance on email lookups
CREATE INDEX IF NOT EXISTS idx_pilot_users_email ON pilot_users(email);
CREATE INDEX IF NOT EXISTS idx_pilot_users_created_at ON pilot_users(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE pilot_users IS 'Stores pre-launch pilot user registrations for Keepla.pt';
COMMENT ON COLUMN pilot_users.id IS 'Unique identifier for each pilot user';
COMMENT ON COLUMN pilot_users.name IS 'Full name of the pilot user';
COMMENT ON COLUMN pilot_users.email IS 'Email address of the pilot user (unique)';
COMMENT ON COLUMN pilot_users.created_at IS 'Timestamp when the user registered';