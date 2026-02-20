# Estrutura do Repositório

## Organização Atual

### `/src`
Código-fonte da aplicação React + TypeScript.
- `/components` - Componentes React reutilizáveis
- `/pages` - Páginas/rotas
- `/hooks` - Hooks customizados
- `/lib` - Utilitários e funções auxiliares
- `/contexts` - Context API do React
- `/services` - Serviços de dados/lógica
- `/styles` - Estilos globais CSS
- `/types` - Tipagens TypeScript

### `/docs`
Documentação do projeto.
- `/brand` - Manual de identidade visual
- `/development` - Documentação técnica e contribuição
- `/security` - Auditorias e segurança
- `/reports` - Relatórios e diagnósticos históricos

### `/ops`
Operações, infraestrutura e automação.
- `/scripts` - Scripts de deployment, testes e manutenção

### `/supabase`
Configuração e código backend Supabase.
- `/functions` - Edge Functions
- `/migrations` - Migrações de base de dados
- `config.toml` - Configuração do Supabase

### Outras pastas relevantes
- `/cypress/e2e` - Testes E2E
- `/legal` - Documentos legais
- `/public` - Assets estáticos
- `/scripts` - Scripts de suporte de produto/editorial
- `/sql` - SQL utilitário (seed/apoio)

## Regras de Manutenção

1. Código de app deve permanecer em `/src`.
2. Documentação deve ficar em `/docs` (usar subpastas por domínio).
3. Evitar ficheiros temporários na raiz (logs, outputs de comandos).
4. Scripts operacionais em `/ops/scripts`; scripts de domínio em `/scripts`.
5. Atualizar `README.md` quando a estrutura principal mudar.
