import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const createDemoUsers = async () => {
  try {
    // Admin Demo User
    const { error: adminError } = await supabase.auth.signUp({
      email: 'admin@keepla.pt',
      password: 'senha123',
    });

    if (adminError) {
      console.error('Erro ao criar usuário admin demo:', adminError.message);
    } else {
      console.log('Usuário admin demo criado com sucesso.');
    }

    // Cliente Demo User
    const { data: demoData, error: demoError } = await supabase.auth.signUp({
      email: 'demo@keepla.pt',
      password: 'senha123',
    });

    if (demoError) {
      console.error('Erro ao criar usuário demo:', demoError.message);
    } else {
      console.log('Usuário demo criado com sucesso.');
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
