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

const createDemoUsers = async () => {
  try {
    // Generate secure passwords for demo accounts
    const adminPassword = process.env.DEMO_ADMIN_PASSWORD || generateSecurePassword();
    const userPassword = process.env.DEMO_USER_PASSWORD || generateSecurePassword();
    
    // Admin Demo User
    const { error: adminError } = await supabase.auth.signUp({
      email: 'admin@keepla.pt',
      password: adminPassword,
    });

    if (adminError) {
      console.error('Erro ao criar usuário admin demo:', adminError.message);
    } else {
      console.log('Usuário admin demo criado com sucesso.');
    }

    // Cliente Demo User
    const { data: demoData, error: demoError } = await supabase.auth.signUp({
      email: 'demo@keepla.pt',
      password: userPassword,
    });

    if (demoError) {
      console.error('Erro ao criar usuário demo:', demoError.message);
    } else {
      console.log('Usuário demo criado com sucesso.');
      console.log('IMPORTANTE: Anote as credenciais geradas para acesso:');
      console.log('Admin Email: admin@keepla.pt');
      console.log(`Admin Password: ${adminPassword}`);
      console.log('User Email: demo@keepla.pt');
      console.log(`User Password: ${userPassword}`);
      console.log('AVISO: Estas senhas não serão exibidas novamente. Guarde-as em um local seguro.');
      
      // Save credentials to a secure environment file that is git-ignored
      console.log('\nRecomendação: Adicione estas credenciais ao seu arquivo .env.local:');
      console.log(`DEMO_ADMIN_PASSWORD=${adminPassword}`);
      console.log(`DEMO_USER_PASSWORD=${userPassword}`);
      console.log('\nNunca compartilhe ou cometa estas credenciais em repositórios públicos.');
      
      // Criar cápsula para o usuário demo
      if (demoData?.user?.id) {
        const { error: capsuleError } = await supabase
          .from('keepsakes')
          .insert([{ title: 'Cápsula de Teste', description: 'Cápsula criada para o usuário demo.', user_id: demoData.user.id, delivery_date: new Date().toISOString() }]);
        if (capsuleError) {
          console.error('Erro ao criar cápsula para usuário demo:', capsuleError.message);
        } else {
          console.log('Cápsula criada para usuário demo com sucesso.');
        }
      }
    }
  } catch (error) {
    console.error('Erro ao criar usuários demo:', error);
  }
};

createDemoUsers();
