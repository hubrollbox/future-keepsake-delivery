import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

interface TopicData {
  id: string;
  title: string;
  pillar: string;
  angle: string;
  target_keyword: string;
  secondary_keywords: string[];
  target_audience: string;
  tone: string;
  estimated_word_count: number;
  cta: string;
  notes: string;
  slug?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .trim();
}

function generateBlogContent(topic: TopicData): string {
  const { title, angle, target_keyword, secondary_keywords, target_audience, tone, cta, notes, estimated_word_count } = topic;
  
  // Generate structured blog post content based on topic metadata
  const sections = [];
  
  // Introduction
  sections.push(`<h2>Introdução</h2>`);
  sections.push(`<p>Quando pensamos em <strong>${target_keyword}</strong>, deparamo-nos com algo profundamente humano — a necessidade de preservar, partilhar e celebrar os momentos que nos definem.</p>`);
  sections.push(`<p>Neste artigo, vamos explorar este tema com um olhar ${tone.toLowerCase()}, pensado especificamente para ${target_audience.toLowerCase()}.</p>`);
  
  // Main content based on angle
  if (angle.toLowerCase().includes('guia') || angle.toLowerCase().includes('tutorial')) {
    sections.push(`<h2>Como começar: um guia passo a passo</h2>`);
    sections.push(`<p>Se procuras orientação prática sobre <strong>${target_keyword}</strong>, estás no sítio certo. Aqui ficam os passos essenciais:</p>`);
    sections.push(`<ol>`);
    sections.push(`<li><strong>Passo 1:</strong> Reflete sobre o que é verdadeiramente importante para ti e para quem amas.</li>`);
    sections.push(`<li><strong>Passo 2:</strong> Escolhe o formato que melhor transmite a tua mensagem — texto, vídeo, ou um presente físico.</li>`);
    sections.push(`<li><strong>Passo 3:</strong> Define o momento perfeito para a entrega, considerando datas especiais ou marcos pessoais.</li>`);
    sections.push(`<li><strong>Passo 4:</strong> Personaliza cada detalhe com cuidado, tornando a experiência única e inesquecível.</li>`);
    sections.push(`</ol>`);
  } else if (angle.toLowerCase().includes('educativo') || angle.toLowerCase().includes('ciência')) {
    sections.push(`<h2>O que a ciência nos diz</h2>`);
    sections.push(`<p>A investigação em ${secondary_keywords[0] || target_keyword} revela facetas fascinantes sobre a forma como processamos e valorizamos as nossas experiências.</p>`);
    sections.push(`<p>Estudos recentes mostram que o ato de preservar memórias não é apenas emocional — tem impacto real no nosso bem-estar psicológico e na construção da nossa identidade.</p>`);
  } else if (angle.toLowerCase().includes('emocional') || angle.toLowerCase().includes('reflexão')) {
    sections.push(`<h2>Uma reflexão sobre o que realmente importa</h2>`);
    sections.push(`<p>Vivemos rodeados de distrações, mas há momentos que merecem ser guardados com todo o cuidado do mundo. ${target_keyword} é mais do que um gesto — é uma declaração de amor ao futuro.</p>`);
    sections.push(`<p>Quando paramos para pensar no que queremos deixar a quem amamos, descobrimos algo profundo sobre nós próprios.</p>`);
  }
  
  // Secondary keywords section
  if (secondary_keywords.length > 1) {
    sections.push(`<h2>${secondary_keywords[1] ? `Explorando: ${secondary_keywords[1]}` : 'Aprofundando o tema'}</h2>`);
    sections.push(`<p>Para além do conceito principal, é importante compreender como ${secondary_keywords.slice(0, 3).join(', ')} se interligam e criam uma experiência mais rica e significativa.</p>`);
    sections.push(`<p>Cada um destes elementos contribui para transformar um simples gesto em algo verdadeiramente memorável.</p>`);
  }
  
  // Notes-based section
  if (notes) {
    sections.push(`<h2>Dicas práticas</h2>`);
    sections.push(`<p>${notes}</p>`);
  }
  
  // Keepla integration
  sections.push(`<h2>Como a Keepla pode ajudar</h2>`);
  sections.push(`<p>Na <strong>Keepla</strong>, acreditamos que as memórias merecem ser tratadas com o mesmo cuidado que dedicamos às pessoas que amamos. A nossa plataforma permite-te criar keepsakes — cápsulas do tempo que guardam palavras, emoções e presentes para serem entregues no momento perfeito.</p>`);
  sections.push(`<p>Seja uma carta para o futuro, um vídeo especial, ou um presente físico guardado com segurança, a Keepla garante que a tua mensagem chega quando é mais necessária.</p>`);
  
  // Conclusion with CTA
  sections.push(`<h2>Conclusão</h2>`);
  sections.push(`<p>O tempo é o recurso mais precioso que temos, e a forma como o usamos define as memórias que deixamos. Não adies o que podes fazer hoje — cada palavra escrita com o coração tem o poder de transformar o amanhã.</p>`);
  sections.push(`<p><strong>${cta}</strong> — porque o amor, quando guardado com cuidado, chega sempre na hora certa.</p>`);
  
  return sections.join('\n');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!adminRole) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { topic } = await req.json() as { topic: TopicData };

    if (!topic || !topic.title) {
      return new Response(
        JSON.stringify({ error: 'Topic data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate blog content
    const content = generateBlogContent(topic);
    const slug = topic.slug || slugify(topic.title);
    const excerpt = `Descobre tudo sobre ${topic.target_keyword}. ${topic.angle} pensado para ${topic.target_audience.split(',')[0]}.`.substring(0, 160);

    // Check for duplicate slug
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug);

    const finalSlug = existing && existing.length > 0 
      ? `${slug}-${Date.now().toString(36)}` 
      : slug;

    // Insert as draft
    const { data: post, error: insertError } = await supabase
      .from('blog_posts')
      .insert({
        title: topic.title,
        slug: finalSlug,
        excerpt,
        content,
        status: 'draft',
        author_id: user.id,
        author_name: 'Equipa Keepla',
        tags: null,
        cover_image_url: '/og-image.png',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save draft', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        post,
        message: `Rascunho "${topic.title}" criado com sucesso. Revê e aprova na aba Artigos.`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-blog-draft:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
