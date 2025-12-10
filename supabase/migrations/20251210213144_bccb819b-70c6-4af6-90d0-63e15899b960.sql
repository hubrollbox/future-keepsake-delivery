-- Desativar todos os produtos antigos
UPDATE products SET active = false;

-- Inserir produtos do catálogo Keepla

-- 1. Mensagem Digital Simples (GRÁTIS) - "Primeira Memória"
INSERT INTO products (name, description, type, price, icon, poetry, active, stock)
VALUES (
  'Primeira Memória',
  'Envia a tua primeira mensagem para o futuro, completamente grátis. Escreve uma carta, define a data de entrega, e deixa que o tempo faça a sua magia. Perfeito para experimentar a emoção de receber uma mensagem do passado.',
  'digital',
  0.00,
  'mail',
  'A primeira memória é sempre especial. Guarda-a para sempre.',
  true,
  9999
);

-- 2. Cápsula Digital Premium (9,90€) - "Memória Eterna"
INSERT INTO products (name, description, type, price, icon, poetry, active, stock)
VALUES (
  'Memória Eterna',
  'Cria uma cápsula do tempo digital completa, sem limites. Escreve cartas longas, anexa fotos e vídeos preciosos, e envia para até 5 pessoas especiais. As tuas memórias, preservadas com segurança e entregues no momento perfeito.',
  'digital',
  9.90,
  'star',
  'Texto ilimitado • Fotos e vídeos (50MB) • Até 5 destinatários • Templates premium • Certificado digital',
  true,
  9999
);

-- 3. Pacote Familiar (24,90€) - "Legado Familiar"
INSERT INTO products (name, description, type, price, icon, poetry, active, stock)
VALUES (
  'Legado Familiar',
  'Cria memórias para toda a família. Com 5 Cápsulas Digitais Premium, cada membro pode guardar as suas histórias, conselhos e emoções para o futuro. Poupa 50% e constrói o legado da tua família, uma memória de cada vez.',
  'digital',
  24.90,
  'users',
  '5 Cápsulas Premium • Cápsulas colaborativas • Dashboard familiar • Poupa 50%',
  true,
  9999
);

-- 4. Carta Física Futura (14,90€) - "Carta do Coração"
INSERT INTO products (name, description, type, price, icon, poetry, active, stock)
VALUES (
  'Carta do Coração',
  'Escreve uma carta à mão, com a tua letra, o teu toque. Envia-nos e guardaremos com todo o cuidado até ao dia perfeito. Porque há palavras que merecem ser escritas em papel e entregues pelas mãos do tempo.',
  'physical',
  14.90,
  'pen-tool',
  'Carta manuscrita • Envelope premium • Certificado de autenticidade • Seguro incluído',
  true,
  100
);

-- 5. Cápsula Física Compacta (29,90€) - "Tesouro do Tempo"
INSERT INTO products (name, description, type, price, icon, poetry, active, stock)
VALUES (
  'Tesouro do Tempo',
  'Guarda um presente físico pequeno mas significativo. Uma joia, uma fotografia, um objeto especial. Combinado com a tua mensagem digital, cria uma experiência única que atravessa o tempo. O presente perfeito para momentos extraordinários.',
  'physical',
  29.90,
  'gift',
  'Caixa premium Keepla • Até 500g • Armazenamento climatizado • Seguro até 200€',
  true,
  50
);

-- Bundle "Memória Completa"
INSERT INTO products (name, description, type, price, icon, poetry, active, stock)
VALUES (
  'Memória Completa',
  '1 Cápsula Digital Premium + 1 Carta Física. A combinação perfeita entre o digital e o tangível. Poupa 1,90€ em relação aos produtos individuais.',
  'bundle',
  22.90,
  'package',
  'Cápsula Digital Premium + Carta do Coração • Poupa 1,90€',
  true,
  100
);

-- Bundle "Legado Geracional"
INSERT INTO products (name, description, type, price, icon, poetry, active, stock)
VALUES (
  'Legado Geracional',
  'Pacote Familiar + 3 Cartas Físicas. Cria um legado completo para toda a família com memórias digitais e cartas escritas à mão. Poupa 4,70€.',
  'bundle',
  64.90,
  'heart',
  'Pacote Familiar (5 cápsulas) + 3 Cartas do Coração • Poupa 4,70€',
  true,
  50
);