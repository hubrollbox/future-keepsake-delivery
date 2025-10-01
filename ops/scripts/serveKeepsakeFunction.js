// Script para servir a Edge Function localmente para testes

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';



// Obter o diretório atual do script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Caminho para a função send-keepsakes
const functionPath = join(projectRoot, 'supabase', 'functions');

async function serveFunction() {
  try {
    console.log('Iniciando servidor local para a função send-keepsakes...');
    
    // Verificar variáveis de ambiente necessárias
    const resendApiKey = process.env.RESEND_API_KEY;
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!resendApiKey || !supabaseUrl || !supabaseServiceKey) {
      console.error('Erro: Variáveis de ambiente necessárias não estão definidas');
      console.log('Certifique-se de que as seguintes variáveis estão definidas no arquivo .env:');
      console.log('- RESEND_API_KEY');
      console.log('- VITE_SUPABASE_URL');
      console.log('- SUPABASE_SERVICE_ROLE_KEY');
      process.exit(1);
    }
    
    // Navegar para o diretório das funções
    process.chdir(functionPath);
    console.log(`Diretório atual: ${process.cwd()}`);
    
    // Servir a função localmente
    console.log('Iniciando servidor local...');
    
    // Configurar variáveis de ambiente para o servidor local
    const envVars = {
      RESEND_API_KEY: resendApiKey,
      SUPABASE_URL: supabaseUrl,
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey
    };
    
    // Criar string de variáveis de ambiente para o comando

    
    // Executar o comando para servir a função localmente
    console.log('Executando supabase functions serve...');
    console.log('Pressione Ctrl+C para parar o servidor');
    
    // Usar spawn para manter o processo em execução e mostrar a saída em tempo real
    const { spawn } = await import('child_process');
    const serveProcess = spawn('supabase', ['functions', 'serve', 'send-keepsakes'], {
      env: { ...process.env, ...envVars },
      stdio: 'inherit',
      shell: true
    });
    
    // Lidar com o encerramento do processo
    serveProcess.on('close', (code) => {
      console.log(`Servidor encerrado com código ${code}`);
      process.exit(code);
    });
    
    // Lidar com erros
    serveProcess.on('error', (error) => {
      console.error('Erro ao iniciar o servidor:', error);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('Erro durante a execução:', error);
    process.exit(1);
  }
}

// Executar o servidor
serveFunction();