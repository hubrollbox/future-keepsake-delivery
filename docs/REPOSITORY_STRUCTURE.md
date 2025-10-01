# Estrutura do Repositório

## Organização de Pastas

### `/src`
Código-fonte da aplicação React + TypeScript
- `/components` - Componentes React reutilizáveis
- `/pages` - Páginas da aplicação
- `/hooks` - Custom hooks
- `/integrations` - Integrações com serviços externos (Supabase, Stripe)
- `/lib` - Utilitários e funções auxiliares
- `/contexts` - Context API do React
- `/styles` - Estilos globais CSS
- `/__tests__` - Testes unitários e de integração

### `/docs`
Documentação do projeto
- `/brand` - Manual de identidade visual, guidelines, paleta de cores
- `/marketing` - Templates de email, materiais de marketing
- `/security` - Documentação de segurança e auditorias
- `/development` - Documentação técnica, changelog, guias de contribuição

### `/ops`
Operações, infraestrutura e automação
- `/scripts` - Scripts de deployment, testes, otimização
- Ficheiros de configuração de CI/CD ficam em `.github/workflows`

### `/supabase`
Configuração e código do backend Supabase
- `/functions` - Edge Functions (serverless)
- `/migrations` - Migrações de base de dados (read-only)
- `config.toml` - Configuração do Supabase

### `/cypress`
Testes end-to-end com Cypress
- `/e2e` - Testes E2E organizados por fluxo

### `/legal`
Documentos legais (GDPR, privacidade, termos)

### `/public`
Assets estáticos servidos publicamente

## Ficheiros de Configuração (Raiz)

- `vite.config.ts` - Configuração do Vite
- `vitest.config.ts` - Configuração dos testes
- `tailwind.config.ts` - Configuração do Tailwind CSS
- `tsconfig.json` - Configuração do TypeScript
- `vercel.json` - Configuração do deploy Vercel
- `.env` - Variáveis de ambiente (não versionado)

## Guidelines

1. **Código da aplicação** → `/src`
2. **Documentação** → `/docs`
3. **Scripts e automação** → `/ops/scripts`
4. **Testes E2E** → `/cypress/e2e`
5. **Testes unitários** → `/src/__tests__`
6. **Configuração CI/CD** → `.github/workflows`

## Benefícios desta Estrutura

- ✅ Separação clara entre código, docs e ops
- ✅ Facilita onboarding de novos developers
- ✅ Automação mais simples (scripts centralizados)
- ✅ Melhor organização para crescimento do projeto
