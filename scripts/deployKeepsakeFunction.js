// Script para implantar a Edge Function send-keepsakes no Supabase
import { exec } from 'child_process';
import { promisify } from 'util';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const execAsync = promisify(exec);

// Obter o diretório atual do script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Caminho para a função send-keepsakes
const functionPath = join(projectRoot, 'supabase', 'functions', 'send-keepsakes');

async function deployFunction() {
  try {
    console.log('Iniciando implantação da função send-keepsakes...');
    
    // Verificar se o projeto está configurado
    const projectRef = process.env.SUPABASE_PROJECT_REF;
    
    if (!projectRef) {
      console.error('Erro: Variável de ambiente SUPABASE_PROJECT_REF não está definida');
      console.log('Adicione SUPABASE_PROJECT_REF=seu-ref-projeto ao arquivo .env');
      process.exit(1);
    }
    
    // Navegar para o diretório da função
    process.chdir(functionPath);
    console.log(`Diretório atual: ${process.cwd()}`);
    
    // Implantar a função
    console.log(`Implantando função para o projeto ${projectRef}...`);
    const { stdout, stderr } = await execAsync(`supabase functions deploy send-keepsakes --project-ref ${projectRef}`);
    
    if (stderr) {
      console.error('Erro durante a implantação:', stderr);
      process.exit(1);
    }
    
    console.log('Saída da implantação:', stdout);
    console.log('Função implantada com sucesso!');
    
    // Voltar para o diretório raiz
    process.chdir(projectRoot);
    
    // Executar a migração SQL
    console.log('Executando migração SQL...');
    const { stdout: migrationStdout, stderr: migrationStderr } = await execAsync(`supabase migration up --project-ref ${projectRef}`);
    
    if (migrationStderr) {
      console.error('Erro durante a migração:', migrationStderr);
      process.exit(1);
    }
    
    console.log('Saída da migração:', migrationStdout);
    console.log('Migração executada com sucesso!');
    
  } catch (error) {
    console.error('Erro durante a implantação:', error);
    process.exit(1);
  }
}

// Executar a implantação
deployFunction();