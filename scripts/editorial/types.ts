/**
 * Tipos TypeScript para o sistema editorial Keepla
 */

export type TopicStatus = 'por_escrever' | 'em_andamento' | 'gerado' | 'em_revisao' | 'publicado';
export type TopicPriority = 'alta' | 'media' | 'baixa';

export interface EditorialPillar {
  id: string;
  name: string;
  description: string;
}

export interface EditorialTopic {
  id: string;
  pillar: string;
  status: TopicStatus;
  priority: TopicPriority;
  title: string;
  angle: string;
  target_keyword: string;
  secondary_keywords: string[];
  target_audience: string;
  tone: string;
  estimated_word_count: number;
  cta: string;
  notes: string;
  created_at: string;
  generation_date: string | null;
  published_date: string | null;
  slug: string | null;
}

export interface EditorialDatabase {
  meta: {
    project: string;
    description: string;
    version: string;
    last_updated: string;
  };
  pillars: EditorialPillar[];
  topics: EditorialTopic[];
}

export interface DraftFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  target_keyword: string;
  secondary_keywords: string[];
  author_name: string;
  status: 'draft' | 'published';
  cover_image_url: string | null;
  topic_id: string;
  pillar: string;
  cta: string;
  generated_at: string;
  estimated_word_count: number;
}

export interface GeneratedDraft {
  frontmatter: DraftFrontmatter;
  content: string;
  raw_markdown: string;
  word_count: number;
  validation_passed: boolean;
  validation_errors: string[];
}

export interface SyncResult {
  success: boolean;
  post_id?: string;
  slug?: string;
  error?: string;
}
