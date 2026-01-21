// Test script for keepsake access - uses shared Supabase client
// Note: This file is kept for backwards compatibility
// For new tests, use the TypeScript version: testKeepsakeAccess.ts

import { supabase } from '../integrations/supabase/client.js';

async function testKeepsakeAccess() {
  console.log('🔍 Testando acesso às cápsulas do tempo...');
  
  try {
    // Verificar se há uma sessão ativa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erro ao obter sessão:', sessionError);
      return;
    }
    
    console.log('📊 Status da sessão:', session ? 'Ativa' : 'Inativa');
    
    // Tentar buscar keepsakes sem autenticação (para testar RLS)
    console.log('🔍 Tentando buscar keepsakes sem autenticação...');
    const { data: keepsakes, error: keepsakeError } = await supabase
      .from('keepsakes')
      .select('*')
      .limit(5);
    
    if (keepsakeError) {
      console.error('❌ Erro ao buscar keepsakes (sem auth):', keepsakeError);
      console.log('Código do erro:', keepsakeError.code);
      console.log('Mensagem:', keepsakeError.message);
      console.log('Detalhes:', keepsakeError.details);
      console.log('Hint:', keepsakeError.hint);
    } else {
      console.log('✅ Keepsakes encontradas (sem auth):', keepsakes?.length || 0);
    }
    
    // Verificar se existem usuários na tabela profiles
    console.log('🔍 Verificando usuários existentes...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .limit(5);
    
    if (profilesError) {
      console.error('❌ Erro ao buscar profiles:', profilesError);
    } else {
      console.log('👥 Profiles encontrados:', profiles?.length || 0);
      if (profiles && profiles.length > 0) {
        console.log('Primeiro profile:', profiles[0]);
      }
    }
    
    // Verificar se existem keepsakes na tabela (contagem total)
    console.log('🔍 Verificando total de keepsakes...');
    const { count, error: countError } = await supabase
      .from('keepsakes')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Erro ao contar keepsakes:', countError);
    } else {
      console.log('📊 Total de keepsakes na base de dados:', count);
    }
    
    // Verificar se a função is_admin_secure existe
    console.log('🔍 Testando função is_admin_secure...');
    const { data: isAdminResult, error: isAdminError } = await supabase
      .rpc('is_admin_secure');
    
    if (isAdminError) {
      console.error('❌ Erro ao testar is_admin_secure:', isAdminError);
      console.log('Código:', isAdminError.code);
      console.log('Mensagem:', isAdminError.message);
    } else {
      console.log('🔐 is_admin_secure resultado:', isAdminResult);
    }
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar o teste
testKeepsakeAccess().then(() => {
  console.log('🏁 Teste concluído');
}).catch((error) => {
  console.error('💥 Erro fatal:', error);
});

export { testKeepsakeAccess };
