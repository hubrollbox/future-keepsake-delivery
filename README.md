Keepla – Plataforma de Presentes com Alma 
Keepla é uma plataforma inovadora para criar, enviar e receber cápsulas do tempo digitais e presentes personalizados, conectando pessoas de maneira significativa e duradoura. 
 
✨ Principais Funcionalidades 
Cápsulas do Tempo Digitais: Crie mensagens, fotos e vídeos para serem entregues no futuro. 
Entrega Automática: Sistema automatizado para entrega de keepsakes digitais na data programada.
Gamificação: Conquiste insígnias, complete missões e receba recompensas. 
Gestão de Entregas: Controle total das cápsulas e presentes, com notificações inteligentes. 
Área do Usuário: Histórico de envios, recebimentos e estatísticas personalizadas. 
Privacidade e Segurança: Dados protegidos por autenticação robusta. 
🛠️ Tecnologias Utilizadas 
Frontend: React + TypeScript 
Backend/Database: Supabase (PostgreSQL, Auth, Storage, Edge Functions) 
Email: Resend 
Pagamentos: Stripe 
Testes: Cypress (E2E) 
Build e Dev: Vite 
🚀 Como Rodar o Projeto Localmente 
Clone este repositório 
 
bash 
git clone `https://github.com/hubrollbox/future-keepsake-delivery.git`  
cd future-keepsake-delivery 
Instale as dependências 
 
bash 
npm install 
Configure as variáveis de ambiente 
 
Copie o arquivo .env.example para .env: 
bash 
cp .env.example .env 
Preencha as variáveis com suas credenciais do Supabase, Stripe, Resend, etc. 
Inicie o servidor de desenvolvimento 
 
bash 
npm run dev 
Acesse a aplicação 
 
http://localhost:5173 

🚀 Funcionalidade de Entrega Automática de Keepsakes

Para configurar e testar a entrega automática de keepsakes digitais:

1. Configure as variáveis de ambiente adicionais:
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase
   - `RESEND_API_KEY`: Chave da API Resend para envio de emails
   - `SUPABASE_PROJECT_REF`: Referência do projeto Supabase (para implantação)

2. Scripts disponíveis:
   - `npm run keepsake:serve`: Inicia o servidor local da Edge Function
   - `npm run keepsake:test`: Testa a Edge Function localmente
   - `npm run keepsake:deploy`: Implanta a Edge Function no Supabase
   - `npm run keepsake:update`: Atualiza o status dos keepsakes manualmente
   - `npm run keepsake:status`: Verifica o status da implantação 
📁 Estrutura do Projeto 
Code 
future-keepsake-delivery/ 
├── src/ 
│   ├── components/   # Componentes reutilizáveis 
│   ├── pages/        # Páginas da aplicação 
│   ├── contexts/     # Contextos globais (autenticação, carrinho, gamificação) 
│   ├── hooks/        # Hooks customizados 
├── supabase/ 
│   ├── migrations/   # Scripts de migração do banco de dados
│   └── functions/    # Edge Functions do Supabase
│       └── send-keepsakes/  # Função para entrega automática de keepsakes
├── scripts/         # Scripts utilitários
│   ├── testSendKeepsakes.js       # Teste da função send-keepsakes
│   ├── updateKeepsakeStatus.js    # Atualização manual de status
│   ├── serveKeepsakeFunction.js   # Servidor local da Edge Function
│   ├── deployKeepsakeFunction.js  # Implantação da Edge Function
│   └── checkDeploymentStatus.js   # Verificação do status da implantação 
🧪 Testes 
Execute testes E2E com o Cypress: 
 
bash 
npx cypress open 
🤝 Contribuindo 
Pull requests são bem-vindos! 
Para contribuir: 
 
Siga as boas práticas de código. 
Descreva claramente suas alterações no PR. 
Certifique-se de que os testes estejam passando. 
📄 Licença 
Este projeto está sob a licença MIT. 
Consulte o arquivo LICENSE para mais informações.
