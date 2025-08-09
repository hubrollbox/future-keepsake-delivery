// Script para atualizar manualmente o status das cápsulas digitais
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

/**
 * Atualiza o status de uma cápsula digital
 * @param {string} keepsakeId - ID da cápsula
 * @param {string} status - Novo status ('scheduled', 'sent', 'error')
 */
async function updateKeepsakeStatus(keepsakeId, status) {
  try {
    if (!keepsakeId) {
      throw new Error('ID da cápsula é obrigatório');
    }
    
    if (!['scheduled', 'sent', 'error'].includes(status)) {
      throw new Error("Status deve ser 'scheduled', 'sent' ou 'error'");
    }
    
    console.log(`Atualizando status da cápsula ${keepsakeId} para ${status}...`);
    
    const { data, error } = await supabase
      .from('keepsakes')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', keepsakeId);
    
    if (error) {
      throw new Error(`Erro ao atualizar status: ${error.message}`);
    }
    
    console.log(`Status atualizado com sucesso!`);
    
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

/**
 * Lista todas as cápsulas digitais com um determinado status
 * @param {string} status - Status a ser filtrado ('scheduled', 'sent', 'error')
 */
async function listKeepsakesByStatus(status) {
  try {
    if (!['scheduled', 'sent', 'error'].includes(status)) {
      throw new Error("Status deve ser 'scheduled', 'sent' ou 'error'");
    }
    
    console.log(`Listando cápsulas com status ${status}...`);
    
    const { data, error } = await supabase
      .from('keepsakes')
      .select('id, title, delivery_date, status, type')
      .eq('status', status)
      .eq('type', 'digital');
    
    if (error) {
      throw new Error(`Erro ao listar cápsulas: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log(`Nenhuma cápsula encontrada com status ${status}`);
      return;
    }
    
    console.log(`Encontradas ${data.length} cápsulas:`);
    data.forEach(keepsake => {
      console.log(`- ID: ${keepsake.id}, Título: ${keepsake.title}, Data de Entrega: ${keepsake.delivery_date}`);
    });
    
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

// Processar argumentos da linha de comando
const args = process.argv.slice(2);
const command = args[0];

if (command === 'update') {
  const keepsakeId = args[1];
  const status = args[2];
  
  if (!keepsakeId || !status) {
    console.error('Uso: node updateKeepsakeStatus.js update <keepsakeId> <status>');
    process.exit(1);
  }
  
  updateKeepsakeStatus(keepsakeId, status);
} else if (command === 'list') {
  const status = args[1] || 'scheduled';
  listKeepsakesByStatus(status);
} else {
  console.log('Comandos disponíveis:');
  console.log('  node updateKeepsakeStatus.js update <keepsakeId> <status> - Atualiza o status de uma cápsula');
  console.log('  node updateKeepsakeStatus.js list <status> - Lista cápsulas com o status especificado');
}