#!/usr/bin/env npx ts-node
/**
 * generateDraft.ts
 * Gera um rascunho de blog post usando IA (OpenAI/Lovable AI Gateway).
 *
 * Uso:
 *   OPENAI_API_KEY=sk-... npx ts-node scripts/editorial/generateDraft.ts <topic-id>
 *
 * Variáveis de ambiente necessárias:
 *   AI_API_KEY          Chave de API (OpenAI ou Lovable AI Gateway)
 *   AI_BASE_URL         URL base da API (default: https://api.openai.com/v1)
 *   AI_MODEL            Modelo a usar (default: gpt-4o-mini)
 */

import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';
import type { EditorialTopic, GeneratedDraft, DraftFrontmatter } from './types';
import { loadDatabase, selectTopic } from './selectTopic';

// Configuração da API de IA
const AI_API_KEY = process.env['AI_API_KEY'] || process.env['OPENAI_API_KEY'] || '';
const AI_BASE_URL = process.env['AI_BASE_URL'] || 'https://api.openai.com/v1';
const AI_MODEL = process.env['AI_MODEL'] || 'gpt-4o-mini';

if (!AI_API_KEY) {
  console.error('❌ Variável de ambiente AI_API_KEY não definida.');
  console.error('   Para usar com Lovable AI Gateway:');
  console.error('   AI_API_KEY=<key> AI_BASE_URL=https://ai.gateway.lovable.dev/v1 AI_MODEL=google/gemini-3-flash-preview npx ts-node ...');
  process.exit(1);
}

const client = new OpenAI({
  apiKey: AI_API_KEY,
  baseURL: AI_BASE_URL,
});

function buildSystemPrompt(): string {
  return `És um escritor de conteúdo especializado para o blog Keepla, uma plataforma portuguesa de keepsakes digitais que permite às pessoas preservar memórias e enviar mensagens para o futuro.

MISSÃO DA KEEPLA:
A Keepla ajuda pessoas a guardar as suas emoções mais preciosas em cápsulas do tempo digitais, cartas para o futuro, e keepsakes físicos — para serem recebidos em datas especiais ou momentos importantes da vida.

REGRAS DE QUALIDADE OBRIGATÓRIAS:
1. NUNCA inventes dados, percentagens, estudos ou estatísticas. Se mencionares investigação científica, usa apenas factos amplamente conhecidos e cita o investigador/instituição de forma genérica (ex: "Investigadores da Universidade de Southampton estudaram...").
2. Escreve sempre em Português Europeu (Portugal), nunca Brasileiro.
3. O tom deve ser: cálido, autêntico, próximo — como um amigo que entende do assunto. Nunca soar a marketing agressivo.
4. Estrutura obrigatória:
   - Introdução envolvente (sem "Neste artigo vamos ver...")
   - 3-5 secções com headings H2 (##)
   - Sub-secções H3 quando necessário (###)
   - Conclusão com chamada à ação subtil para a Keepla
5. Comprimento: entre 1500 e 2000 palavras
6. PROIBIDO: clichés como "No mundo atual", "Nos dias de hoje", "É importante", "Como todos sabemos"
7. Cada parágrafo deve ter no máximo 4 linhas
8. Inclui sempre pelo menos um exemplo concreto e prático
9. O keepsake/Keepla deve aparecer de forma natural, nunca forçada. Máximo 2-3 menções ao produto.
10. Escreve o conteúdo completo, pronto para publicação.

OUTPUT: Devolve APENAS o conteúdo em Markdown (sem frontmatter, sem explicações adicionais). Começa diretamente com o texto do artigo.`;
}

function buildUserPrompt(topic: EditorialTopic): string {
  const db = loadDatabase();
  const pillar = db.pillars.find((p) => p.id === topic.pillar);

  return `Escreve um artigo de blog para a Keepla com as seguintes especificações:

TÍTULO: ${topic.title}

ÂNGULO/ABORDAGEM: ${topic.angle}

PILAR EDITORIAL: ${pillar?.name || topic.pillar} — ${pillar?.description || ''}

PALAVRA-CHAVE PRINCIPAL: "${topic.target_keyword}"
PALAVRAS-CHAVE SECUNDÁRIAS: ${topic.secondary_keywords.join(', ')}

PÚBLICO-ALVO: ${topic.target_audience}

TOM: ${topic.tone}

COMPRIMENTO ESPERADO: ${topic.estimated_word_count} palavras (entre 1500-2000)

CHAMADA À AÇÃO FINAL: ${topic.cta}

NOTAS EDITORIAIS IMPORTANTES:
${topic.notes}

INSTRUÇÕES ADICIONAIS:
- A palavra-chave principal "${topic.target_keyword}" deve aparecer no primeiro parágrafo e de 2 a 3 vezes ao longo do texto de forma natural.
- As palavras-chave secundárias devem aparecer pelo menos uma vez cada.
- O título não deve ser repetido no início do conteúdo (o frontmatter trata disso).
- A conclusão deve fluir naturalmente para a CTA sem ser comercial.

Escreve o artigo completo agora:`;
}

function validateDraft(content: string, expectedWordCount: number): { passed: boolean; errors: string[] } {
  const errors: string[] = [];
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  if (wordCount < 1200) {
    errors.push(`Conteúdo muito curto: ${wordCount} palavras (mínimo: 1200)`);
  }
  if (wordCount > 2500) {
    errors.push(`Conteúdo muito longo: ${wordCount} palavras (máximo: 2500)`);
  }

  const h2Count = (content.match(/^## /gm) || []).length;
  if (h2Count < 2) {
    errors.push(`Poucos headings H2: ${h2Count} (mínimo: 2)`);
  }

  const forbiddenPhrases = [
    'No mundo atual',
    'Nos dias de hoje',
    'Como todos sabemos',
    'É importante referir',
    'Neste artigo vamos',
  ];
  forbiddenPhrases.forEach((phrase) => {
    if (content.includes(phrase)) {
      errors.push(`Frase proibida encontrada: "${phrase}"`);
    }
  });

  return { passed: errors.length === 0, errors };
}

async function generateDraft(topicId: string): Promise<GeneratedDraft> {
  console.log(`\n🤖 Iniciando geração para tema: ${topicId}`);
  console.log(`   Modelo: ${AI_MODEL}`);
  console.log(`   API: ${AI_BASE_URL}\n`);

  // Selecionar e marcar tema
  const topic = selectTopic(topicId);

  console.log(`📝 Tema: ${topic.title}`);
  console.log(`   KW: ${topic.target_keyword}`);
  console.log(`   Palavras esperadas: ~${topic.estimated_word_count}\n`);
  console.log('⏳ A gerar conteúdo com IA...');

  const completion = await client.chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: buildUserPrompt(topic) },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const rawContent = completion.choices[0]?.message?.content;

  if (!rawContent) {
    throw new Error('A IA não devolveu conteúdo.');
  }

  const content = rawContent.trim();
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const validation = validateDraft(content, topic.estimated_word_count);

  console.log(`✅ Conteúdo gerado: ${wordCount} palavras`);

  if (!validation.passed) {
    console.warn('⚠️  Avisos de validação:');
    validation.errors.forEach((e) => console.warn(`   - ${e}`));
  } else {
    console.log('✅ Validação passou!');
  }

  // Gerar excerpt automático (primeiros 160 caracteres de texto corrido)
  const cleanContent = content.replace(/^#+\s+.+$/gm, '').replace(/\n+/g, ' ').trim();
  const excerpt = cleanContent.substring(0, 160).trim() + '...';

  const frontmatter: DraftFrontmatter = {
    title: topic.title,
    slug: '',
    excerpt,
    tags: [topic.pillar, ...topic.secondary_keywords.slice(0, 3)],
    target_keyword: topic.target_keyword,
    secondary_keywords: topic.secondary_keywords,
    author_name: 'Equipa Keepla',
    status: 'draft',
    cover_image_url: null,
    topic_id: topic.id,
    pillar: topic.pillar,
    cta: topic.cta,
    generated_at: new Date().toISOString(),
    estimated_word_count: wordCount,
  };

  return {
    frontmatter,
    content,
    raw_markdown: content,
    word_count: wordCount,
    validation_passed: validation.passed,
    validation_errors: validation.errors,
  };
}

// CLI Entry point
const topicId = process.argv[2];

if (!topicId) {
  console.error('❌ Uso: npx ts-node scripts/editorial/generateDraft.ts <topic-id>');
  console.error('   Exemplo: npx ts-node scripts/editorial/generateDraft.ts topic-001');
  process.exit(1);
}

generateDraft(topicId)
  .then((draft) => {
    // Guardar o draft em JSON temporário para o formatDraft.ts
    const tmpDir = path.join(__dirname, '.tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    const tmpFile = path.join(tmpDir, `${topicId}-draft.json`);
    fs.writeFileSync(tmpFile, JSON.stringify(draft, null, 2), 'utf-8');
    console.log(`\n💾 Draft guardado em: ${tmpFile}`);
    console.log(`\n➡️  Próximo passo: npx ts-node scripts/editorial/formatDraft.ts ${topicId}`);
  })
  .catch((err: Error) => {
    console.error('❌ Erro na geração:', err.message);
    process.exit(1);
  });

export { generateDraft };
