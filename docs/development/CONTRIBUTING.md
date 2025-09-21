# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o **FuturoPresente**! Este guia irá ajudá-lo a entender como contribuir de forma efetiva para o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Funcionalidades](#sugerir-funcionalidades)
- [Testes](#testes)

## 📜 Código de Conduta

Este projeto adere a um código de conduta. Ao participar, você concorda em manter um ambiente respeitoso e inclusivo para todos.

### Comportamentos Esperados

- Use linguagem acolhedora e inclusiva
- Respeite diferentes pontos de vista e experiências
- Aceite críticas construtivas graciosamente
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros da comunidade

## 🚀 Como Contribuir

### Tipos de Contribuição

- **🐛 Correção de Bugs**: Identifique e corrija problemas existentes
- **✨ Novas Funcionalidades**: Implemente recursos solicitados ou propostos
- **📚 Documentação**: Melhore ou adicione documentação
- **🧪 Testes**: Adicione ou melhore a cobertura de testes
- **🎨 UI/UX**: Melhore a interface e experiência do usuário
- **⚡ Performance**: Otimize o desempenho da aplicação

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Git**
- **Conta Supabase** (para desenvolvimento)

### Configuração Inicial

1. **Fork o repositório**
   ```bash
   # Clique em "Fork" no GitHub
   ```

2. **Clone seu fork**
   ```bash
   git clone https://github.com/seu-usuario/future-keepsake-delivery.git
   cd future-keepsake-delivery
   ```

3. **Adicione o repositório original como upstream**
   ```bash
   git remote add upstream https://github.com/original-owner/future-keepsake-delivery.git
   ```

4. **Instale as dependências**
   ```bash
   npm install
   ```

5. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   # Edite .env.local com suas configurações
   ```

6. **Execute os testes**
   ```bash
   npm run test
   ```

7. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## 📝 Padrões de Código

### Estilo de Código

- **TypeScript**: Use tipagem estrita sempre que possível
- **ESLint**: Siga as regras configuradas no projeto
- **Prettier**: Use para formatação automática
- **Convenções de Nomenclatura**:
  - Componentes: `PascalCase` (ex: `KeepsakeCard`)
  - Funções: `camelCase` (ex: `sendKeepsake`)
  - Constantes: `UPPER_SNAKE_CASE` (ex: `MAX_FILE_SIZE`)
  - Arquivos: `kebab-case` (ex: `keepsake-form.tsx`)

### Estrutura de Componentes

```typescript
// Imports externos
import React from 'react'
import { useState } from 'react'

// Imports internos
import { Button } from '@/components/ui/button'
import { useKeepsakes } from '@/hooks/useKeepsakes'

// Tipos
interface ComponentProps {
  title: string
  onSubmit: (data: FormData) => void
}

// Componente
export const Component: React.FC<ComponentProps> = ({ title, onSubmit }) => {
  // Estados
  const [isLoading, setIsLoading] = useState(false)
  
  // Hooks
  const { keepsakes } = useKeepsakes()
  
  // Handlers
  const handleSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Render
  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  )
}
```

### Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, ponto e vírgula, etc
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção

**Exemplos:**
```
feat(keepsakes): add delivery scheduling functionality
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
```

## 🔄 Processo de Pull Request

### Antes de Submeter

1. **Sincronize com upstream**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/nome-da-feature
   ```

3. **Faça suas alterações**
   - Implemente a funcionalidade
   - Adicione testes se necessário
   - Atualize documentação se necessário

4. **Execute os testes**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

5. **Commit suas alterações**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Submetendo o PR

1. **Push para seu fork**
   ```bash
   git push origin feature/nome-da-feature
   ```

2. **Abra um Pull Request**
   - Vá para o GitHub e clique em "New Pull Request"
   - Preencha o template de PR
   - Adicione screenshots se aplicável
   - Marque reviewers se necessário

### Template de PR

```markdown
## Descrição
Descreva brevemente as alterações realizadas.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Passo 3

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Todos os testes passam
```

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verifique se o bug já foi reportado
2. Teste na versão mais recente
3. Colete informações sobre o ambiente

### Template de Bug Report

```markdown
**Descrição do Bug**
Descrição clara e concisa do problema.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Role para baixo até '...'
4. Veja o erro

**Comportamento Esperado**
Descreva o que deveria acontecer.

**Screenshots**
Adicione screenshots se aplicável.

**Ambiente:**
- OS: [ex: Windows 10]
- Browser: [ex: Chrome 91]
- Versão: [ex: 1.0.0]

**Informações Adicionais**
Qualquer outra informação relevante.
```

## 💡 Sugerir Funcionalidades

### Template de Feature Request

```markdown
**Problema Relacionado**
Descreva o problema que esta funcionalidade resolveria.

**Solução Proposta**
Descreva a solução que você gostaria de ver.

**Alternativas Consideradas**
Descreva alternativas que você considerou.

**Informações Adicionais**
Qualquer outra informação ou screenshots.
```

## 🧪 Testes

### Executando Testes

```bash
# Todos os testes
npm run test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:coverage

# Testes E2E
npm run test:e2e
```

### Escrevendo Testes

- **Unitários**: Para funções e hooks
- **Integração**: Para componentes
- **E2E**: Para fluxos completos

```typescript
// Exemplo de teste unitário
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

## 📞 Suporte

Se você tiver dúvidas:

- 📧 Email: suporte@futuropresente.com
- 💬 Discord: [Link do servidor]
- 📋 Issues: [GitHub Issues](https://github.com/owner/repo/issues)

## 🙏 Reconhecimento

Todos os contribuidores serão reconhecidos no arquivo CONTRIBUTORS.md e nos releases do projeto.

Obrigado por contribuir para o FuturoPresente! 🚀