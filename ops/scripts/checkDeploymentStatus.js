// Script para verificar o status da implantação da Edge Function e do cron job
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import fetch from 'node-fetch';

async function checkDeploymentStatus() {
  try {
    console.log('Verificando status da implantação da funcionalidade de entrega automática de keepsakes...');
    
    // Verificar variáveis de ambiente necessárias
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Erro: Variáveis de ambiente necessárias não estão definidas');
      console.log('Certifique-se de que as seguintes variáveis estão definidas no arquivo .env:');
      console.log('- VITE_SUPABASE_URL');
      console.log('- SUPABASE_SERVICE_ROLE_KEY');
      process.exit(1);
    }
    
    // Inicializar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('\n=== Verificando Edge Function ===');
    
    // Verificar se a Edge Function está disponível
    try {
      const functionUrl = `${supabaseUrl}/functions/v1/send-keepsakes`;
      console.log(`Testando função em: ${functionUrl}`);
      
      const response = await fetch(functionUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`
        }
      });
      
      console.log(`Status da resposta: ${response.status}`);
      
      if (response.status === 200) {
        console.log('✅ Edge Function está disponível');
      } else if (response.status === 404) {
        console.log('❌ Edge Function não encontrada. Verifique se ela foi implantada corretamente.');
      } else {
        console.log(`⚠️ Edge Function retornou status ${response.status}. Verifique os logs para mais detalhes.`);
      }

  } catch (_) {
 
                                            console.error('❌ Erro ao verificar Edge Function:', _.message);
    }
    
    console.log('\n=== Verificando Cron Job ===');
    
    // Verificar se o cron job está configurado
    try {
      const { data: cronJobs, error: cronError } = await supabase
        .from('cron_job_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (cronError) {
        console.error('❌ Erro ao verificar logs do cron job:', cronError.message);
        console.log('A tabela cron_job_logs pode não existir. Verifique se a migração SQL foi executada.');
      } else if (cronJobs && cronJobs.length > 0) {
        console.log('✅ Logs do cron job encontrados. Últimas execuções:');
        cronJobs.forEach(job => {
          const status = job.success ? '✅ Sucesso' : '❌ Falha';
          console.log(`${status} - ${new Date(job.created_at).toLocaleString()} - ${job.result}`);
        });
      } else {
        console.log('⚠️ Nenhum log de cron job encontrado. O job pode não ter sido executado ainda.');
      }
      
      // Verificar configuração do cron job usando SQL
      const { data: cronConfig, error: configError } = await supabase
        .rpc('check_cron_job_exists');
      
      if (configError) {
        console.error('❌ Erro ao verificar configuração do cron job:', configError.message);
        console.log('A função check_cron_job_exists pode não existir. Criando função temporária...');
        
        // Criar função temporária para verificar o cron job
        const { error: createFuncError } = await supabase.rpc('create_check_cron_job_function');
        
        if (createFuncError) {
          console.error('❌ Erro ao criar função temporária:', createFuncError.message);
        } else {
          console.log('✅ Função temporária criada. Verificando cron job novamente...');
          
          const { data: cronConfigRetry, error: configErrorRetry } = await supabase
            .rpc('check_cron_job_exists');
          
          if (configErrorRetry) {
            console.error('❌ Erro ao verificar configuração do cron job:', configErrorRetry.message);
          } else if (cronConfigRetry && cronConfigRetry.length > 0) {
            console.log('✅ Cron job configurado corretamente:');
            console.log(cronConfigRetry);
          } else {
            console.log('❌ Cron job não encontrado. Verifique se a migração SQL foi executada.');
          }
        }
      } else if (cronConfig && cronConfig.length > 0) {
        console.log('✅ Cron job configurado corretamente:');
        console.log(cronConfig);
      } else {
        console.log('❌ Cron job não encontrado. Verifique se a migração SQL foi executada.');
      }
    } catch (_) {
 
                                   console.error('❌ Erro ao verificar cron job:', _.message);
    }
    
    console.log('\n=== Verificando Tabelas do Banco de Dados ===');
    
    // Verificar tabelas necessárias
    try {
      // Verificar tabela keepsakes
      const { error: keepsakesError } = await supabase
        .from('keepsakes')
        .select('id, status')
        .limit(1);
      
      if (keepsakesError) {
        console.error('❌ Erro ao verificar tabela keepsakes:', keepsakesError.message);
      } else {
        console.log('✅ Tabela keepsakes está acessível');
      }
      
      // Verificar tabela recipients
      const { error: recipientsError } = await supabase
        .from('recipients')
        .select('id, email')
        .limit(1);
      
      if (recipientsError) {
        console.error('❌ Erro ao verificar tabela recipients:', recipientsError.message);
      } else {
        console.log('✅ Tabela recipients está acessível');
      }
      
      // Verificar tabela cron_job_logs
      const { error: cronLogsError } = await supabase
        .from('cron_job_logs')
        .select('id')
        .limit(1);
      
      if (cronLogsError) {
        console.error('❌ Erro ao verificar tabela cron_job_logs:', cronLogsError.message);
      } else {
        console.log('✅ Tabela cron_job_logs está acessível');
      }

      // Verificar tabela blog_posts
      const { error: blogPostsError } = await supabase
        .from('blog_posts')
        .select('id')
        .limit(1);
      
      if (blogPostsError) {
        console.error('❌ Erro ao verificar tabela blog_posts:', blogPostsError.message);
        console.log('ℹ️ Dica: verifica se a migração `20251018_add_blog_posts.sql` foi aplicada no teu projeto Supabase.');
      } else {
        console.log('✅ Tabela blog_posts está acessível');
      }
    } catch (_) {
      console.error('❌ Erro ao verificar tabelas:', _.message);
    }
    
    console.log('\n=== Resumo da Verificação ===');
    console.log('Verifique os resultados acima para garantir que todos os componentes estão funcionando corretamente.');
    console.log('Se encontrar problemas, consulte o arquivo docs/deployment_instructions.md para instruções de solução de problemas.');
    
  } catch (_) {
    console.error('Erro durante a verificação:', _);
    process.exit(1);
  }
}

// Criar funções SQL temporárias para verificação
async function createSQLFunctions() {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Criar função para verificar se o cron job existe
    const createCheckCronJobFunction = `
      CREATE OR REPLACE FUNCTION public.create_check_cron_job_function()
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        -- Criar função para verificar se o cron job existe
        CREATE OR REPLACE FUNCTION public.check_cron_job_exists()
        RETURNS TABLE(jobname text, schedule text, command text, active boolean)
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $func$
        BEGIN
          RETURN QUERY
          SELECT 
            job.jobname::text,
            job.schedule::text,
            job.command::text,
            job.active
          FROM 
            cron.job job
          WHERE 
            job.jobname = 'process-keepsakes-daily';
        END;
        $func$;
      END;
      $$;
    `;
    
    // Executar SQL para criar a função
    const { error } = await supabase.rpc('create_check_cron_job_function');
    
    if (error) {
      // Se a função não existe, crie-a usando SQL bruto
      await supabase.sql(createCheckCronJobFunction);
    }
    } catch {
      // Ignorar erros aqui, eles serão tratados na função principal
  }
}

// Executar a verificação
createSQLFunctions().then(() => {
  checkDeploymentStatus();
});