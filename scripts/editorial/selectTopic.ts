#!/usr/bin/env npx ts-node
/**
 * selectTopic.ts
 * Seleciona e gere temas do banco editorial Keepla.
 *
 * Uso:
 *   npx ts-node scripts/editorial/selectTopic.ts list
 *   npx ts-node scripts/editorial/selectTopic.ts select <topic-id>
 *   npx ts-node scripts/editorial/selectTopic.ts status <topic-id> <new-status>
 */

import * as fs from 'fs';
import * as path from 'path';
import type { EditorialDatabase, EditorialTopic, TopicStatus } from './types';

const DB_PATH = path.join(__dirname, 'database', 'editorial-database.json');

function loadDatabase(): EditorialDatabase {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw) as EditorialDatabase;
}

function saveDatabase(db: EditorialDatabase): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

function listTopics(filter?: TopicStatus): void {
  const db = loadDatabase();
  const topics = filter
    ? db.topics.filter((t) => t.status === filter)
    : db.topics;

  if (topics.length === 0) {
    console.log(`\nNenhum tema encontrado${filter ? ` com estado "${filter}"` : ''}.`);
    return;
  }

  console.log(`\n📋 Temas${filter ? ` (${filter})` : ''} — ${topics.length} encontrado(s)\n`);
  console.log('─'.repeat(80));

  topics.forEach((topic) => {
    const pillar = db.pillars.find((p) => p.id === topic.pillar);
    const statusEmoji: Record<string, string> = {
      por_escrever: '⬜',
      em_andamento: '🔄',
      gerado: '✅',
      em_revisao: '👁️',
      publicado: '🚀',
    };
    console.log(`${statusEmoji[topic.status] || '❓'} [${topic.id}] ${topic.title}`);
    console.log(
      `   Pilar: ${pillar?.name || topic.pillar} | Prioridade: ${topic.priority} | KW: ${topic.target_keyword}`
    );
    if (topic.generation_date) {
      console.log(`   Gerado em: ${topic.generation_date}`);
    }
    console.log('');
  });
}

function selectTopic(topicId: string): EditorialTopic {
  const db = loadDatabase();
  const topicIndex = db.topics.findIndex((t) => t.id === topicId);

  if (topicIndex === -1) {
    console.error(`❌ Tema "${topicId}" não encontrado.`);
    console.error('   Use: npx ts-node scripts/editorial/selectTopic.ts list');
    process.exit(1);
  }

  const topic = db.topics[topicIndex];

  if (!topic) {
    console.error(`❌ Tema "${topicId}" não encontrado.`);
    process.exit(1);
  }

  if (topic.status === 'publicado') {
    console.warn(`⚠️  Tema "${topicId}" já foi publicado.`);
  }

  if (topic.status === 'em_andamento') {
    console.warn(`⚠️  Tema "${topicId}" já está em andamento.`);
  }

  // Atualizar estado para em_andamento
  db.topics[topicIndex] = {
    ...topic,
    status: 'em_andamento',
    generation_date: new Date().toISOString().split('T')[0] ?? new Date().toISOString(),
  };

  saveDatabase(db);

  console.log(`✅ Tema selecionado: ${topic.title}`);
  console.log(`   ID: ${topic.id}`);
  console.log(`   Estado atualizado para: em_andamento`);

  return db.topics[topicIndex] as EditorialTopic;
}

function updateTopicStatus(topicId: string, newStatus: TopicStatus): void {
  const db = loadDatabase();
  const topicIndex = db.topics.findIndex((t) => t.id === topicId);

  if (topicIndex === -1) {
    console.error(`❌ Tema "${topicId}" não encontrado.`);
    process.exit(1);
  }

  const topic = db.topics[topicIndex];
  if (!topic) {
    process.exit(1);
  }

  const oldStatus = topic.status;
  db.topics[topicIndex] = { ...topic, status: newStatus };

  if (newStatus === 'publicado') {
    db.topics[topicIndex]!.published_date = new Date().toISOString().split('T')[0] ?? new Date().toISOString();
  }

  saveDatabase(db);
  console.log(`✅ Estado do tema "${topicId}" atualizado: ${oldStatus} → ${newStatus}`);
}

function updateTopicSlug(topicId: string, slug: string): void {
  const db = loadDatabase();
  const topicIndex = db.topics.findIndex((t) => t.id === topicId);

  if (topicIndex === -1) return;
  const topic = db.topics[topicIndex];
  if (!topic) return;

  db.topics[topicIndex] = { ...topic, slug };
  saveDatabase(db);
}

// CLI Entry point
const [, , command, ...args] = process.argv;

switch (command) {
  case 'list':
    listTopics(args[0] as TopicStatus | undefined);
    break;

  case 'select':
    if (!args[0]) {
      console.error('❌ Especifica o ID do tema: select <topic-id>');
      process.exit(1);
    }
    selectTopic(args[0]);
    break;

  case 'status':
    if (!args[0] || !args[1]) {
      console.error('❌ Uso: status <topic-id> <new-status>');
      process.exit(1);
    }
    updateTopicStatus(args[0], args[1] as TopicStatus);
    break;

  default:
    console.log(`
📚 selectTopic.ts — Gestão do Banco Editorial Keepla

Comandos:
  list [status]           Lista temas (opcional: filtrar por status)
  select <topic-id>       Seleciona um tema (marca como em_andamento)
  status <id> <status>    Atualiza o estado de um tema

Estados válidos: por_escrever | em_andamento | gerado | em_revisao | publicado

Exemplos:
  npx ts-node scripts/editorial/selectTopic.ts list
  npx ts-node scripts/editorial/selectTopic.ts list por_escrever
  npx ts-node scripts/editorial/selectTopic.ts select topic-001
  npx ts-node scripts/editorial/selectTopic.ts status topic-001 publicado
    `);
}

export { loadDatabase, saveDatabase, selectTopic, updateTopicStatus, updateTopicSlug };
