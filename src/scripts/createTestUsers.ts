import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const createTestUsers = async () => {
  try {
    // Create admin user
    const { data: adminData, error: adminError } = await supabase.auth.signUp({
      email: 'admin@keepla.pt',
      password: 'senha123',
    });

    if (adminError) {
      console.error('Error creating admin user:', adminError.message);
    } else {
      console.log('Admin user created successfully.');
      if (adminData?.user?.id) {
        const { error: roleError } = await supabase
          .from('admin_roles')
          .insert([{ user_id: adminData.user.id, role: 'admin' }]);
        if (roleError) {
          console.error('Error assigning admin role:', roleError.message);
        } else {
          console.log('Admin role assigned successfully.');
        }
      }
    }

    // Create demo user
    const { data: demoData, error: demoError } = await supabase.auth.signUp({
      email: 'demo@keepla.pt',
      password: 'senha123',
    });

    if (demoError) {
      console.error('Error creating demo user:', demoError.message);
    } else {
      console.log('Demo user created successfully.');
      if (demoData?.user?.id) {
        const { error: capsuleError } = await supabase
          .from('keepsakes')
          .insert([{ title: 'Test Capsule', description: 'Capsule created for demo user.', user_id: demoData.user.id, delivery_date: new Date().toISOString() }]);
        if (capsuleError) {
          console.error('Error creating capsule for demo user:', capsuleError.message);
        } else {
          console.log('Capsule created for demo user successfully.');
        }
      }
    }
  } catch (error) {
    console.error('Error creating test users:', error);
  }
};

createTestUsers();