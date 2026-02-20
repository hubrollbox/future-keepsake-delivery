#!/usr/bin/env npx ts-node
/**
 * seoAudit.ts
 * Gera um relatório SEO dos posts publicados no Supabase.
 * Pode ser expandido para integrar Google Search Console API.
 *
 * Uso:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/editorial/seoAudit.ts
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/editorial/seoAudit.ts --report
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env['SUPABASE_URL'] || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'] || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

interface BlogPostSeoData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  tags: string[] | null;
  views: number | null;
  status: string;
  published_at: string | null;
  created_at: string;
  content_length?: number;
}

interface SeoAuditResult {
  post: BlogPostSeoData;
  checks: SeoCheck[];
  score: number;
  issues: string[];
  suggestions: string[];
}

interface SeoCheck {
  name: string;
  passed: boolean;
  detail: string;
}

function auditPost(post: BlogPostSeoData): SeoAuditResult {
  const checks: SeoCheck[] = [];
  const issues: string[] = [];
  const suggestions: string[] = [];

  // 1. Título tem comprimento adequado (50-60 chars)
  const titleLen = post.title.length;
  const titleOk = titleLen >= 30 && titleLen <= 65;
  checks.push({
    name: 'Comprimento do título',
    passed: titleOk,
    detail: `${titleLen} caracteres (ideal: 30-65)`,
  });
  if (!titleOk) {
    if (titleLen < 30) issues.push('Título demasiado curto (< 30 chars)');
    else suggestions.push('Título um pouco longo — considere encurtar para < 65 chars');
  }

  // 2. Excerpt existe e tem comprimento adequado
  const excerptLen = post.excerpt?.length || 0;
  const excerptOk = excerptLen >= 100 && excerptLen <= 165;
  checks.push({
    name: 'Meta description (excerpt)',
    passed: excerptOk,
    detail: excerptLen === 0 ? 'Em falta!' : `${excerptLen} caracteres (ideal: 100-165)`,
  });
  if (excerptLen === 0) issues.push('Excerpt/meta description em falta — crítico para SEO');
  else if (!excerptOk) suggestions.push('Ajustar excerpt para 100-165 caracteres');

  // 3. Tags/categorias definidas
  const hasTags = post.tags && post.tags.length > 0;
  checks.push({
    name: 'Tags definidas',
    passed: !!hasTags,
    detail: hasTags ? `${post.tags!.length} tags` : 'Sem tags',
  });
  if (!hasTags) suggestions.push('Adicionar tags para melhorar categorização');

  // 4. Slug é amigável (só minúsculas, hífens, sem caracteres especiais)
  const slugOk = /^[a-z0-9-]+$/.test(post.slug);
  checks.push({
    name: 'Slug URL-friendly',
    passed: slugOk,
    detail: post.slug,
  });
  if (!slugOk) issues.push(`Slug contém caracteres problemáticos: ${post.slug}`);

  // 5. Post tem data de publicação
  const hasPublishedAt = !!post.published_at;
  checks.push({
    name: 'Data de publicação definida',
    passed: hasPublishedAt,
    detail: post.published_at || 'Em falta',
  });
  if (!hasPublishedAt) issues.push('published_at não definido — pode afetar indexação');

  // 6. Conteúdo tem comprimento adequado (estimativa)
  const contentLen = post.content_length || 0;
  const contentOk = contentLen >= 1200;
  if (contentLen > 0) {
    checks.push({
      name: 'Comprimento do conteúdo',
      passed: contentOk,
      detail: `~${contentLen} palavras (mínimo recomendado: 1200)`,
    });
    if (!contentOk) suggestions.push('Conteúdo abaixo de 1200 palavras — expandir para melhor SEO');
  }

  // Calcular score (0-100)
  const passedChecks = checks.filter((c) => c.passed).length;
  const score = Math.round((passedChecks / checks.length) * 100);

  return { post, checks, score, issues, suggestions };
}

function generateMarkdownReport(results: SeoAuditResult[]): string {
  const now = new Date().toISOString().split('T')[0] ?? new Date().toISOString().slice(0, 10);
  const avgScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);

  let md = `# 📊 Relatório SEO — Blog Keepla

**Data:** ${now}
**Posts analisados:** ${results.length}
**Score médio:** ${avgScore}/100

---

## Resumo por Post

| Post | Score | Issues | Sugestões |
|------|-------|--------|-----------|
`;

  results.forEach((r) => {
    const scoreEmoji = r.score >= 80 ? '🟢' : r.score >= 60 ? '🟡' : '🔴';
    md += `| ${r.post.title.substring(0, 40)}${r.post.title.length > 40 ? '...' : ''} | ${scoreEmoji} ${r.score}/100 | ${r.issues.length} | ${r.suggestions.length} |\n`;
  });

  md += '\n---\n\n## Análise Detalhada\n\n';

  results.forEach((r) => {
    md += `### ${r.post.title}\n\n`;
    md += `- **Slug:** \`${r.post.slug}\`\n`;
    md += `- **Score:** ${r.score}/100\n`;
    md += `- **Publicado:** ${r.post.published_at || 'Não publicado'}\n`;
    md += `- **Views:** ${r.post.views || 0}\n\n`;

    if (r.issues.length > 0) {
      md += '**❌ Issues críticos:**\n';
      r.issues.forEach((i) => (md += `- ${i}\n`));
      md += '\n';
    }

    if (r.suggestions.length > 0) {
      md += '**💡 Sugestões:**\n';
      r.suggestions.forEach((s) => (md += `- ${s}\n`));
      md += '\n';
    }

    md += '**Checklist de verificações:**\n';
    r.checks.forEach((c) => {
      md += `- ${c.passed ? '✅' : '❌'} **${c.name}:** ${c.detail}\n`;
    });

    md += '\n---\n\n';
  });

  md += `## 📋 Recomendações Gerais\n\n`;
  md += `Com base nesta análise, as prioridades editoriais para o próximo mês são:\n\n`;

  const criticalIssues = results.flatMap((r) => r.issues);
  if (criticalIssues.length > 0) {
    md += `**Issues críticos a resolver:**\n`;
    [...new Set(criticalIssues)].forEach((i) => (md += `- ${i}\n`));
    md += '\n';
  }

  md += `**Posts com menor score (necessitam atenção):**\n`;
  results
    .filter((r) => r.score < 70)
    .sort((a, b) => a.score - b.score)
    .forEach((r) => (md += `- ${r.post.title} (${r.score}/100)\n`));

  md += `\n---\n*Relatório gerado automaticamente pelo sistema editorial Keepla.*\n`;

  return md;
}

async function runAudit(generateReport = false): Promise<void> {
  console.log('\n🔍 A obter posts publicados do Supabase...\n');

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, tags, views, status, published_at, created_at, content')
    .in('status', ['published', 'draft'])
    .order('published_at', { ascending: false });

  if (error) {
    console.error('❌ Erro ao obter posts:', error.message);
    process.exit(1);
  }

  if (!posts || posts.length === 0) {
    console.log('📭 Nenhum post encontrado no Supabase.');
    return;
  }

  console.log(`📋 ${posts.length} post(s) encontrado(s)\n`);

  // Enriquecer com contagem de palavras estimada
  const enrichedPosts: BlogPostSeoData[] = posts.map((p: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    tags: string[] | null;
    views: number | null;
    status: string;
    published_at: string | null;
    created_at: string;
    content: string;
  }) => ({
    ...p,
    content_length: p.content ? p.content.split(/\s+/).filter(Boolean).length : 0,
    content: undefined,
  }));

  const results = enrichedPosts.map(auditPost);

  // Mostrar resumo no terminal
  console.log('═'.repeat(70));
  console.log('📊 RELATÓRIO SEO — KEEPLA BLOG');
  console.log('═'.repeat(70));

  results.forEach((r) => {
    const scoreEmoji = r.score >= 80 ? '🟢' : r.score >= 60 ? '🟡' : '🔴';
    console.log(`\n${scoreEmoji} [${r.score}/100] ${r.post.title}`);
    console.log(`   Slug: ${r.post.slug} | Views: ${r.post.views || 0}`);

    if (r.issues.length > 0) {
      r.issues.forEach((i) => console.log(`   ❌ ${i}`));
    }
    if (r.suggestions.length > 0) {
      r.suggestions.forEach((s) => console.log(`   💡 ${s}`));
    }
  });

  const avgScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
  console.log('\n' + '═'.repeat(70));
  console.log(`📊 Score médio: ${avgScore}/100`);
  console.log(`   Posts acima de 80: ${results.filter((r) => r.score >= 80).length}`);
  console.log(`   Posts com issues: ${results.filter((r) => r.issues.length > 0).length}`);
  console.log('═'.repeat(70));

  if (generateReport) {
    const reportDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const today = new Date().toISOString().split('T')[0] ?? new Date().toISOString().slice(0, 10);
    const reportPath = path.join(reportDir, `seo-audit-${today}.md`);
    const reportContent = generateMarkdownReport(results);

    fs.writeFileSync(reportPath, reportContent, 'utf-8');
    console.log(`\n📄 Relatório guardado em: ${reportPath}`);
  }
}

// CLI Entry point
const args = process.argv.slice(2);
const generateReport = args.includes('--report');

runAudit(generateReport).catch((err: Error) => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
