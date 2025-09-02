import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Generate a secure random password
const generateSecurePassword = (): string => {
  // Generate a secure random string of 16 bytes and convert to hex
  const randomBytes = crypto.randomBytes(16).toString('hex');
  // Add special characters and mixed case to ensure password complexity
  return `${randomBytes.substring(0, 8)}!${randomBytes.substring(8, 16).toUpperCase()}#${randomBytes.substring(16, 24)}`;
};

const createTestUsers = async () => {
  try {
    // Generate secure passwords for test accounts
    const adminPassword = process.env.TEST_ADMIN_PASSWORD || generateSecurePassword();
    const userPassword = process.env.TEST_USER_PASSWORD || generateSecurePassword();
    
    // Create admin user
    const { data: adminData, error: adminError } = await supabase.auth.signUp({
      email: 'admin@keepla.pt',
      password: adminPassword,
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
      password: userPassword,
    });

    if (demoError) {
      console.error('Error creating demo user:', demoError.message);
    } else {
      console.log('Demo user created successfully.');
      
      // Log the generated credentials (only in test environment)
      console.log('\nIMPORTANTE: Credenciais de teste geradas:');
      console.log('Admin Email: admin@keepla.pt');
      console.log(`Admin Password: ${adminPassword}`);
      console.log('User Email: demo@keepla.pt');
      console.log(`User Password: ${userPassword}`);
      console.log('\nAVISO: Estas são credenciais de TESTE. Não use em produção.');
      
      // Save credentials to a secure environment file that is git-ignored
      console.log('\nRecomendação: Adicione estas credenciais ao seu arquivo .env.test.local:');
      console.log(`TEST_ADMIN_PASSWORD=${adminPassword}`);
      console.log(`TEST_USER_PASSWORD=${userPassword}`);
      console.log('\nNunca compartilhe ou cometa estas credenciais em repositórios públicos.');
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