#!/usr/bin/env npx ts-node
/**
 * formatDraft.ts
 * Formata o rascunho gerado em Markdown com frontmatter YAML.
 * Cria o ficheiro .md final na pasta drafts/.
 *
 * Uso:
 *   npx ts-node scripts/editorial/formatDraft.ts <topic-id>
 */

import * as fs from 'fs';
import * as path from 'path';
import slugify from 'slugify';
import type { GeneratedDraft, DraftFrontmatter } from './types';
import { loadDatabase, saveDatabase, updateTopicSlug } from './selectTopic';

const DRAFTS_DIR = path.join(__dirname, 'drafts');
const TMP_DIR = path.join(__dirname, '.tmp');

function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    locale: 'pt',
    replacement: '-',
  });
}

function buildYamlFrontmatter(fm: DraftFrontmatter): string {
  const tagsYaml = fm.tags.map((t) => `  - "${t}"`).join('\n');
  const secondaryKwYaml = fm.secondary_keywords.map((k) => `  - "${k}"`).join('\n');

  return `---
title: "${fm.title.replace(/"/g, '\\"')}"
slug: "${fm.slug}"
excerpt: "${fm.excerpt.replace(/"/g, '\\"')}"
status: "${fm.status}"
author_name: "${fm.author_name}"
cover_image_url: ${fm.cover_image_url ? `"${fm.cover_image_url}"` : 'null'}
tags:
${tagsYaml}
target_keyword: "${fm.target_keyword}"
secondary_keywords:
${secondaryKwYaml}
topic_id: "${fm.topic_id}"
pillar: "${fm.pillar}"
cta: "${fm.cta.replace(/"/g, '\\"')}"
generated_at: "${fm.generated_at}"
word_count: ${fm.estimated_word_count}
# REVISÃO EDITORIAL OBRIGATÓRIA:
# 1. Verificar factos e dados mencionados
# 2. Adicionar cover_image_url (fazer upload no Supabase Storage)
# 3. Ajustar o excerpt para ser mais apelativo (máx. 160 chars)
# 4. Rever o tom e linguagem
# 5. Mudar status de "draft" para "published" quando aprovado
---`;
}

function formatDraft(topicId: string): string {
  // Carregar draft do JSON temporário
  const tmpFile = path.join(TMP_DIR, `${topicId}-draft.json`);

  if (!fs.existsSync(tmpFile)) {
    console.error(`❌ Ficheiro de draft não encontrado: ${tmpFile}`);
    console.error(`   Execute primeiro: npx ts-node scripts/editorial/generateDraft.ts ${topicId}`);
    process.exit(1);
  }

  const draft = JSON.parse(fs.readFileSync(tmpFile, 'utf-8')) as GeneratedDraft;

  // Gerar slug
  const slug = generateSlug(draft.frontmatter.title);
  draft.frontmatter.slug = slug;

  // Atualizar slug no banco editorial
  updateTopicSlug(topicId, slug);

  // Criar diretório de drafts
  if (!fs.existsSync(DRAFTS_DIR)) {
    fs.mkdirSync(DRAFTS_DIR, { recursive: true });
  }

  // Construir o ficheiro Markdown final
  const frontmatter = buildYamlFrontmatter(draft.frontmatter);
  const fullMarkdown = `${frontmatter}\n\n${draft.content}\n`;

  // Nome do ficheiro: YYYY-MM-DD-slug.md
  const today = new Date().toISOString().split('T')[0] ?? new Date().toISOString().slice(0, 10);
  const filename = `${today}-${slug}.md`;
  const outputPath = path.join(DRAFTS_DIR, filename);

  fs.writeFileSync(outputPath, fullMarkdown, 'utf-8');

  // Atualizar estado no banco editorial
  const db = loadDatabase();
  const topicIndex = db.topics.findIndex((t) => t.id === topicId);
  if (topicIndex !== -1 && db.topics[topicIndex]) {
    db.topics[topicIndex]!.status = 'gerado';
    db.topics[topicIndex]!.slug = slug;
  }
  saveDatabase(db);

  // Relatório final
  console.log('\n' + '═'.repeat(60));
  console.log('📄 DRAFT FORMATADO COM SUCESSO');
  console.log('═'.repeat(60));
  console.log(`Ficheiro: ${outputPath}`);
  console.log(`Slug: ${slug}`);
  console.log(`Palavras: ${draft.word_count}`);
  console.log(`Validação: ${draft.validation_passed ? '✅ Passou' : '⚠️  Com avisos'}`);

  if (draft.validation_errors.length > 0) {
    console.log('\nAvisos de validação:');
    draft.validation_errors.forEach((e) => console.log(`  ⚠️  ${e}`));
  }

  console.log('\n📋 PRÓXIMOS PASSOS:');
  console.log('1. Abrir o ficheiro e rever o conteúdo');
  console.log('2. Fazer upload da imagem de capa no Supabase Storage');
  console.log('3. Atualizar cover_image_url no frontmatter');
  console.log('4. Fazer commit e criar PR no GitHub');
  console.log('5. Após merge, o workflow sincroniza automaticamente com o Supabase');
  console.log('═'.repeat(60) + '\n');

  // Limpar ficheiro temporário
  fs.unlinkSync(tmpFile);

  return outputPath;
}

// Validate that a draft file has required frontmatter fields
function validateMarkdownFile(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8');
  const requiredFields = ['title', 'slug', 'excerpt', 'status', 'author_name', 'tags'];
  let allPresent = true;

  requiredFields.forEach((field) => {
    if (!content.includes(`${field}:`)) {
      console.error(`❌ Campo obrigatório em falta no frontmatter: ${field}`);
      allPresent = false;
    }
  });

  // Check word count (rough estimate)
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  if (wordCount < 1000) {
    console.warn(`⚠️  Ficheiro tem apenas ${wordCount} palavras (recomendado: > 1500)`);
  }

  // Check slug format
  const slugMatch = content.match(/^slug:\s*"?([^"\n]+)"?/m);
  if (slugMatch && slugMatch[1]) {
    const slug = slugMatch[1].trim();
    if (!/^[a-z0-9-]+$/.test(slug)) {
      console.error(`❌ Slug inválido: "${slug}" (deve conter apenas letras minúsculas, números e hífens)`);
      allPresent = false;
    } else {
      console.log(`✅ Slug válido: ${slug}`);
    }
  }

  return allPresent;
}

// CLI Entry point
const [, , command, arg] = process.argv;

if (command === 'validate' && arg) {
  // Modo de validação de ficheiro existente
  const filePath = path.resolve(arg);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Ficheiro não encontrado: ${filePath}`);
    process.exit(1);
  }
  const valid = validateMarkdownFile(filePath);
  process.exit(valid ? 0 : 1);
} else if (command) {
  // Modo de formatação (command é o topicId)
  formatDraft(command);
} else {
  console.error('❌ Uso: npx ts-node scripts/editorial/formatDraft.ts <topic-id>');
  console.error('       npx ts-node scripts/editorial/formatDraft.ts validate <ficheiro.md>');
  process.exit(1);
}

export { formatDraft, generateSlug, validateMarkdownFile };
