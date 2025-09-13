// Script para testar a API de keepsakes e identificar problemas
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://mlxmymmoysbtnvcehggn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1seG15bW1veXNidG52Y2VoZ2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDM1MzIsImV4cCI6MjA2NTE3OTUzMn0.NWN13hyHErwzxD-9mW3U4v3S5kDBkSt5d0O49Eol90o';
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

async function testKeepsakesAPI() {
  console.log('🧪 Iniciando testes da API de keepsakes...');
  
  try {
    // 1. Verificar se o usuário está autenticado
    console.log('\n1. Verificando autenticação...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Erro de autenticação:', authError);
      return;
    }
    
    if (!user) {
      console.log('⚠️ Usuário não autenticado. Faça login primeiro.');
      return;
    }
    
    console.log('✅ Usuário autenticado:', user.email, 'ID:', user.id);
    
    // 2. Testar busca de keepsakes
    console.log('\n2. Testando busca de keepsakes...');
    const { data: keepsakes, error: keepsakeError } = await supabase
      .from('keepsakes')
      .select('id, title, delivery_date, status, type, message_content, recipient_email, recipient_phone, sent_at')
      .order('delivery_date', { ascending: false });
    
    if (keepsakeError) {
      console.error('❌ Erro ao buscar keepsakes:', keepsakeError);
      console.log('Código do erro:', keepsakeError.code);
      console.log('Mensagem:', keepsakeError.message);
      console.log('Detalhes:', keepsakeError.details);
      
      // Verificar se é erro de RLS
      if (keepsakeError.code === 'PGRST301' || keepsakeError.message?.includes('RLS')) {
        console.log('🔒 Erro de RLS detectado - usuário não tem permissão para acessar keepsakes');
      }
      
      return;
    }
    
    console.log('✅ Keepsakes encontradas:', keepsakes?.length || 0);
    if (keepsakes && keepsakes.length > 0) {
      console.log('📋 Primeiras keepsakes:', keepsakes.slice(0, 3));
    }
    
    // 3. Verificar perfil do usuário
    console.log('\n3. Verificando perfil do usuário...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Erro ao buscar perfil:', profileError);
    } else {
      console.log('✅ Perfil encontrado:', profile?.full_name || profile?.email);
    }
    
    // 4. Verificar políticas RLS
    console.log('\n4. Verificando políticas RLS...');
    const { data: rlsInfo, error: rlsError } = await supabase
      .rpc('check_rls_policies', { table_name: 'keepsakes' })
      .single();
    
    if (rlsError) {
      console.log('⚠️ Não foi possível verificar políticas RLS:', rlsError.message);
    } else {
      console.log('📋 Informações RLS:', rlsInfo);
    }
    
    // 5. Testar inserção de keepsake (se permitido)
    console.log('\n5. Testando inserção de keepsake de teste...');
    const testKeepsake = {
      title: 'Teste API - ' + new Date().toISOString(),
      message_content: 'Mensagem de teste para verificar API',
      delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 dias no futuro
      status: 'pending',
      type: 'digital',
      user_id: user.id
    };
    
    const { data: insertedKeepsake, error: insertError } = await supabase
      .from('keepsakes')
      .insert(testKeepsake)
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Erro ao inserir keepsake de teste:', insertError);
    } else {
      console.log('✅ Keepsake de teste inserida com sucesso:', insertedKeepsake.id);
      
      // Limpar o teste
      await supabase
        .from('keepsakes')
        .delete()
        .eq('id', insertedKeepsake.id);
      console.log('🧹 Keepsake de teste removida');
    }
    
  } catch (error) {
    console.error('💥 Erro geral no teste:', error);
  }
}

// Executar o teste
testKeepsakesAPI();

console.log('\n📝 Para executar este teste:');
console.log('1. Substitua supabaseUrl e supabaseKey pelas suas credenciais');
console.log('2. Execute: node test-keepsakes-api.js');
console.log('3. Certifique-se de estar logado na aplicação primeiro');