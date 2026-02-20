#!/usr/bin/env npx ts-node
/**
 * syncToSupabase.ts
 * Sincroniza um ficheiro Markdown com a tabela blog_posts no Supabase.
 * Usado pelo workflow sync-blog-to-supabase.yml após merge do PR.
 *
 * Uso:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/editorial/syncToSupabase.ts <ficheiro.md>
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/editorial/syncToSupabase.ts --all
 *
 * Variáveis de ambiente necessárias:
 *   SUPABASE_URL              URL do projeto Supabase
 *   SUPABASE_SERVICE_ROLE_KEY Chave de serviço (NUNCA expor publicamente)
 */

import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';
import type { SyncResult } from './types';

const SUPABASE_URL = process.env['SUPABASE_URL'] || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'] || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variáveis de ambiente em falta:');
  if (!SUPABASE_URL) console.error('   SUPABASE_URL');
  if (!SUPABASE_SERVICE_ROLE_KEY) console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function syncFile(filePath: string): Promise<SyncResult> {
  if (!fs.existsSync(filePath)) {
    return { success: false, error: `Ficheiro não encontrado: ${filePath}` };
  }

  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(rawContent);

  // Validar campos obrigatórios
  const required = ['title', 'slug', 'status', 'author_name'];
  const missing = required.filter((f) => !frontmatter[f]);

  if (missing.length > 0) {
    return {
      success: false,
      error: `Campos obrigatórios em falta no frontmatter: ${missing.join(', ')}`,
    };
  }

  const slug = frontmatter['slug'] as string;
  const status = frontmatter['status'] as string;
  const now = new Date().toISOString();

  const postData = {
    title: frontmatter['title'] as string,
    slug,
    content: content.trim(),
    excerpt: (frontmatter['excerpt'] as string) || null,
    status: status === 'published' ? 'published' : 'draft',
    author_name: (frontmatter['author_name'] as string) || 'Equipa Keepla',
    cover_image_url: (frontmatter['cover_image_url'] as string | null) || null,
    tags: (frontmatter['tags'] as string[]) || [],
    published_at: status === 'published' ? now : null,
    updated_at: now,
  };

  console.log(`\n🔄 A sincronizar: ${postData.title}`);
  console.log(`   Slug: ${slug}`);
  console.log(`   Status: ${postData.status}`);

  // Verificar se já existe (pelo slug)
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('id, slug')
    .eq('slug', slug)
    .single();

  let result;

  if (existing) {
    // Atualizar post existente
    result = await supabase
      .from('blog_posts')
      .update(postData)
      .eq('slug', slug)
      .select('id, slug')
      .single();

    console.log(`   Operação: UPDATE (post existente)`);
  } else {
    // Inserir novo post
    result = await supabase
      .from('blog_posts')
      .insert({ ...postData, created_at: now })
      .select('id, slug')
      .single();

    console.log(`   Operação: INSERT (novo post)`);
  }

  if (result.error) {
    return {
      success: false,
      error: `Erro Supabase: ${result.error.message}`,
    };
  }

  const savedData = result.data as { id: string; slug: string } | null;

  console.log(`   ✅ Sincronizado com sucesso! ID: ${savedData?.id}`);

  return {
    success: true,
    post_id: savedData?.id,
    slug: savedData?.slug,
  };
}

async function syncAllDrafts(): Promise<void> {
  const draftsDir = path.join(__dirname, 'drafts');

  if (!fs.existsSync(draftsDir)) {
    console.log('📁 Pasta drafts/ vazia ou não existente.');
    return;
  }

  const files = fs.readdirSync(draftsDir).filter((f) => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('📁 Nenhum ficheiro .md encontrado em drafts/');
    return;
  }

  console.log(`\n🔄 Sincronizando ${files.length} ficheiro(s)...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = path.join(draftsDir, file);
    const result = await syncFile(filePath);

    if (result.success) {
      successCount++;
    } else {
      errorCount++;
      console.error(`   ❌ Erro: ${result.error}`);
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`📊 SINCRONIZAÇÃO COMPLETA`);
  console.log(`   ✅ Sucesso: ${successCount}`);
  console.log(`   ❌ Erros: ${errorCount}`);
  console.log('═'.repeat(60));
}

// CLI Entry point
const args = process.argv.slice(2);

if (args[0] === '--all') {
  syncAllDrafts().catch((err: Error) => {
    console.error('❌ Erro fatal:', err.message);
    process.exit(1);
  });
} else if (args[0]) {
  const filePath = path.resolve(args[0]);
  syncFile(filePath)
    .then((result) => {
      if (!result.success) {
        console.error(`\n❌ Falha na sincronização: ${result.error}`);
        process.exit(1);
      }
      console.log(`\n🚀 Post publicado: ${SUPABASE_URL.replace('.supabase.co', '')}/blog/${result.slug}`);
    })
    .catch((err: Error) => {
      console.error('❌ Erro fatal:', err.message);
      process.exit(1);
    });
} else {
  console.error('❌ Uso:');
  console.error('   npx ts-node scripts/editorial/syncToSupabase.ts <ficheiro.md>');
  console.error('   npx ts-node scripts/editorial/syncToSupabase.ts --all');
  process.exit(1);
}

export { syncFile };
