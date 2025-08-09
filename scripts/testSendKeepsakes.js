// Script para testar manualmente a função de envio de keepsakes
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Inicializa o cliente Supabase com as credenciais de serviço
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessárias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSendKeepsakes() {
  try {
    console.log('Iniciando teste da função send-keepsakes...');
    
    // Chamar a Edge Function
    const { data, error } = await supabase.functions.invoke('send-keepsakes', {
      method: 'POST',
      body: {},
    });
    
    if (error) {
      throw new Error(`Erro ao chamar a função: ${error.message}`);
    }
    
    console.log('Resultado da função:', data);
    console.log('Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('Erro durante o teste:', error);
  }
}

// Executar o teste
testSendKeepsakes();