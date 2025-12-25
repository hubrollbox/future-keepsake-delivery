import { execSync } from 'child_process';
import fs from 'fs';

async function validateSupabase() { 
  try { 
    // 1. Baixar schema remoto 
    console.log('🔄 Baixando schema remoto...'); 
    execSync('supabase db pull', { stdio: 'inherit' }); 
    
    // 2. Comparar schemas 
    console.log('🔍 Comparando schemas...'); 
    const diff = execSync('supabase db diff').toString(); 
    
    if (diff.trim()) { 
      console.log('⚠️  Diferenças encontradas:'); 
      console.log(diff); 
      fs.writeFileSync('schema-diff.txt', diff); 
    } else { 
      console.log('✅ Schemas idênticos'); 
    } 
    
    // 3. Validar migrações pendentes 
    console.log('📋 Verificando migrações...'); 
    execSync('supabase migration list', { stdio: 'inherit' }); 
    
    // 4. Validar Edge Functions 
    console.log('⚡ Validando Edge Functions...'); 
    const functions = fs.readdirSync('./supabase/functions', { withFileTypes: true }); 
    console.log(`📁 Functions locais: ${functions.length}`); 
    
  } catch (error) { 
    console.error('❌ Erro na validação:', error.message); 
    process.exit(1); 
  } 
} 

validateSupabase();
