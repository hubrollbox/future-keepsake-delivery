

# Reorganizacao do Dashboard de Administracao

## Problema Atual

1. **Erro de build**: `Cannot find type definition file for 'testing-library__jest-dom'` -- o `tsconfig.json` nao inclui os tipos de teste necessarios.
2. **Menu confuso**: O blog tem 3 entradas separadas (Blog, Editorial, Conteudo) e duas rotas conflituantes (`/admin/blog` no App.tsx como `BlogAdmin` e tambem como rota dentro do `AdminDashboard`).
3. **Editorial basico**: O componente `AdminEditorial` e uma tabela simples de rascunhos/publicados, sem mostrar o pipeline de geracao automatica.

## Plano de Alteracoes

### 1. Corrigir o erro de build (tsconfig.json)

Adicionar `@testing-library/jest-dom` aos `compilerOptions.types` no `tsconfig.json` para que o TypeScript encontre as definicoes de tipo.

### 2. Reorganizar o menu do admin

**Estrutura proposta do menu lateral:**

```text
OPERACOES
  - Dashboard
  - Clientes
  - Entregas
  - Produtos
  - Planos
  - Mensagens
  - Pagamentos
  - Armazem

CONTEUDO
  - Blog (com sub-abas internas: Artigos | Editorial)
  - Gamificacao (notificacoes, conquistas, missoes -- antigo "Conteudo")
```

Alteracoes em `AdminLayout.tsx`:
- Renomear grupo "Familia de Conteudo" para "Conteudo"
- Manter apenas "Blog" e "Gamificacao" (antigo "Conteudo") como itens
- Remover os sub-itens "Editorial" e "Conteudo" como filhos do Blog

### 3. Unificar Blog + Editorial num so componente

Reescrever `AdminBlog.tsx` para incluir **2 abas** no topo:

- **Artigos**: A vista atual do AdminBlog (lista de posts, criacao, edicao, publicacao, eliminacao)
- **Editorial**: O pipeline de geracao automatica com:
  - Metricas (topicos por escrever, prioridade alta, cobertura)
  - Estado dos topicos do `editorial-database.json` (pipeline)
  - Rascunhos pendentes de aprovacao (vindos do Supabase com `status = 'draft'`)
  - Acoes de aprovar/despublicar

### 4. Limpar rotas conflituantes

- **App.tsx**: Remover a rota separada `/admin/blog` que aponta para `BlogAdmin`. O blog passa a ser servido pelo `AdminDashboard` como todas as outras seccoes.
- **AdminDashboard.tsx**: Remover a rota `editorial` (fica integrada no blog). Renomear rota `content` para `gamification`.
- Eliminar importacao e uso de `BlogAdmin` no `App.tsx`.

### 5. Renomear AdminContent para AdminGamification

Renomear o ficheiro e o item de menu de "Conteudo" para "Gamificacao", ja que gere notificacoes, conquistas e missoes -- nao conteudo editorial.

## Ficheiros Alterados

| Ficheiro | Acao |
|---|---|
| `tsconfig.json` | Adicionar `types: ["@testing-library/jest-dom"]` |
| `src/App.tsx` | Remover rota `/admin/blog` separada e import de BlogAdmin |
| `src/components/admin/AdminLayout.tsx` | Reorganizar menu: Blog + Gamificacao |
| `src/components/admin/AdminBlog.tsx` | Adicionar aba "Editorial" com pipeline e aprovacao |
| `src/components/admin/AdminEditorial.tsx` | Eliminar (logica integrada no AdminBlog) |
| `src/pages/AdminDashboard.tsx` | Remover rota editorial, renomear content -> gamification |
| `src/components/admin/AdminContent.tsx` | Renomear para AdminGamification (ou manter ficheiro, mudar label) |

## Detalhe Tecnico

### tsconfig.json
```json
"compilerOptions": {
  "types": ["@testing-library/jest-dom"],
  ...
}
```

### AdminBlog.tsx -- nova estrutura com Tabs
```text
<Tabs defaultValue="articles">
  <TabsList>
    <TabsTrigger value="articles">Artigos</TabsTrigger>
    <TabsTrigger value="editorial">Editorial</TabsTrigger>
  </TabsList>
  <TabsContent value="articles">
    ... lista atual de posts + criacao/edicao ...
  </TabsContent>
  <TabsContent value="editorial">
    ... metricas do pipeline ...
    ... topicos do editorial-database.json ...
    ... rascunhos para aprovacao ...
  </TabsContent>
</Tabs>
```

### AdminLayout.tsx -- menu simplificado
```text
menuGroups = [
  {
    id: "operations",
    label: "Operacoes",
    items: [Dashboard, Clientes, Entregas, Produtos, Planos, Mensagens, Pagamentos, Armazem]
  },
  {
    id: "content",
    label: "Conteudo",
    items: [
      { id: "blog", label: "Blog", icon: FileText, path: "/admin/blog" },
      { id: "gamification", label: "Gamificacao", icon: Trophy, path: "/admin/gamification" }
    ]
  }
]
```

