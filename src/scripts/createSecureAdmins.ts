
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const createSecureAdmins = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required');
      process.exit(1);
    }

    // Validate password strength
    if (adminPassword.length < 12) {
      console.error('Admin password must be at least 12 characters long');
      process.exit(1);
    }

    console.log('Creating secure admin user...');

    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });

    if (error) {
      console.error(`Error creating admin user:`, error.message);
      process.exit(1);
    }

    const userId = data.user?.id;
    if (userId) {
      // Insert into admin_roles table
      const { error: roleError } = await supabase
        .from('admin_roles')
        .insert([{ user_id: userId, role: 'admin' }]);

      if (roleError) {
        console.error(`Error assigning admin role:`, roleError.message);
        process.exit(1);
      }

      console.log(`✅ Secure admin user created successfully: ${adminEmail}`);
      console.log('🔐 Please ensure to store the password securely and change it after first login');
    }
  } catch (error) {
    console.error('Error creating secure admin:', error);
    process.exit(1);
  }
};

// Only run if called directly
if (require.main === module) {
  createSecureAdmins();
}

export { createSecureAdmins };
