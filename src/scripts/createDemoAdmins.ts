import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const createDemoAdmins = async () => {
  try {
    // Cria usuários demo admin
    const demoAdmins = [
      { email: 'admin@keepla.pt', password: 'senha123' }
    ];

    for (const admin of demoAdmins) {
      const { data, error } = await supabase.auth.signUp({
        email: admin.email,
        password: admin.password,
      });
      if (error) {
        console.error(`Erro ao criar admin ${admin.email}:`, error.message);
        continue;
      }
      const userId = data.user?.id;
      if (userId) {
        // Insere na tabela admin_roles
        const { error: roleError } = await supabase
          .from('admin_roles')
          .insert([{ user_id: userId, role: 'admin' }]);
        if (roleError) {
          console.error(`Erro ao atribuir role admin para ${admin.email}:`, roleError.message);
        } else {
          console.log(`Admin demo criado: ${admin.email}`);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao criar admins demo:', error);
  }
};

createDemoAdmins();
