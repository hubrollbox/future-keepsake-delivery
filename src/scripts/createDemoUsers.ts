import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const createDemoUsers = async () => {
  try {
    // Admin Demo User
    const { error: adminError } = await supabase.auth.signUp({
      email: 'admin.demo@example.com',
      password: 'admin123',
    });

    if (adminError) {
      console.error('Erro ao criar usuário admin demo:', adminError.message);
    } else {
      console.log('Usuário admin demo criado com sucesso.');
    }

    // Cliente Demo User
    const { error: clienteError } = await supabase.auth.signUp({
      email: 'cliente.demo@example.com',
      password: 'cliente123',
    });

    if (clienteError) {
      console.error('Erro ao criar usuário cliente demo:', clienteError.message);
    } else {
      console.log('Usuário cliente demo criado com sucesso.');
    }
  } catch (error) {
    console.error('Erro ao criar usuários demo:', error);
  }
};

createDemoUsers();
