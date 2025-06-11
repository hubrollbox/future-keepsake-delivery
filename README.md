# Future Keepsake Delivery

![Logo FuturoPresente](public/placeholder.svg)

## Sobre a Plataforma

A Future Keepsake Delivery é uma solução moderna para gestão, armazenamento e entrega programada de keepsakes (lembranças e presentes para o futuro). Desenvolvida para empresas e consumidores finais, a plataforma oferece segurança, personalização e automação em todo o ciclo de vida do presente.

## Principais Funcionalidades
- Cadastro e autenticação de usuários
- Gestão de keepsakes digitais e físicos
- Entregas programadas e notificações automáticas
- Dashboard intuitivo para administradores e usuários
- Integração com Supabase para backend seguro
- Interface responsiva e personalizável
- Suporte a múltiplos métodos de pagamento (se aplicável)

## Tecnologias Utilizadas
- React + TypeScript
- Vite
- Tailwind CSS
- Supabase

## Como Operar e Implantar

### Instalação
```sh
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DA_PASTA>
npm install
```

### Configuração
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
- `VITE_SUPABASE_URL=...`
- `VITE_SUPABASE_ANON_KEY=...`

### Execução em Desenvolvimento
```sh
npm run dev
```

### Build para Produção
```sh
npm run build
```
Os arquivos finais estarão na pasta `dist/`.

### Testes
Para executar os testes unitários e de integração, utilize o comando:
```sh
npm run test
```
Os testes são configurados com Vitest e `@testing-library/react`. Você pode encontrar os arquivos de teste na mesma pasta dos componentes ou em diretórios dedicados a testes.

### Deploy
Para implantar a aplicação em um ambiente de produção, siga os passos:
1. **Build da Aplicação:** Gere os arquivos de produção:
```sh
npm run build
```
Os arquivos otimizados para produção serão gerados na pasta `dist/`.

2. **Configuração de Variáveis de Ambiente:** Certifique-se de que as variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, etc.) estejam configuradas no seu ambiente de deploy. A forma de configurar isso varia de acordo com o provedor de hospedagem (ex: Vercel, Netlify, AWS S3, Nginx).

3. **Servir os Arquivos Estáticos:** Configure seu servidor web (ex: Nginx, Apache) ou serviço de hospedagem para servir os arquivos estáticos da pasta `dist/`. Para aplicações SPA (Single Page Application) como esta, é importante configurar o servidor para redirecionar todas as rotas para o `index.html` para que o roteamento do React funcione corretamente.

Exemplo de configuração Nginx:
```nginx
server {
    listen 80;
    server_name seusite.com;

    root /caminho/para/sua/pasta/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Opcional: Configurações de cache para arquivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        log_not_found off;
    }
}
```

4. **Configuração do Supabase:** Verifique se as configurações do Supabase (URL e chave anon) estão corretas no ambiente de produção e se as políticas de Row Level Security (RLS) estão devidamente configuradas para o acesso público e autenticado.

5. **Monitoramento:** Após o deploy, configure ferramentas de monitoramento para acompanhar a performance da aplicação, erros e logs.

## Estrutura de Pastas
```
├── src/
│   ├── components/   # Componentes reutilizáveis
│   ├── pages/        # Páginas principais
│   ├── hooks/        # Hooks customizados
│   └── ...
├── public/           # Arquivos estáticos
├── package.json      # Dependências e scripts
└── ...
```

## Manutenção e Suporte
- Atualize dependências regularmente via `npm update`.
- Consulte a documentação oficial das tecnologias utilizadas para troubleshooting.
- Para dúvidas ou suporte, utilize o canal oficial da equipe Legalflux.

## Contribuição
1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'feat: minha nova feature'`
4. Push para a branch: `git push origin minha-feature`
5. Abra um Pull Request

---

Legalflux © Todos os direitos reservados.
