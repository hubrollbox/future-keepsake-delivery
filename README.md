Keepla – Plataforma de Presentes com Alma 
Keepla é uma plataforma inovadora para criar, enviar e receber cápsulas do tempo digitais e presentes personalizados, conectando pessoas de maneira significativa e duradoura. 
 
✨ Principais Funcionalidades 
Cápsulas do Tempo Digitais: Crie mensagens, fotos e vídeos para serem entregues no futuro. 
Gamificação: Conquiste insígnias, complete missões e receba recompensas. 
Gestão de Entregas: Controle total das cápsulas e presentes, com notificações inteligentes. 
Área do Usuário: Histórico de envios, recebimentos e estatísticas personalizadas. 
Privacidade e Segurança: Dados protegidos por autenticação robusta. 
🛠️ Tecnologias Utilizadas 
Frontend: React + TypeScript 
Backend/Database: Supabase (PostgreSQL, Auth, Storage) 
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
Preencha as variáveis com suas credenciais do Supabase, Stripe, etc. 
Inicie o servidor de desenvolvimento 
 
bash 
npm run dev 
Acesse a aplicação 
 
http://localhost:5173 
📁 Estrutura do Projeto 
Code 
future-keepsake-delivery/ 
├── src/ 
│   ├── components/   # Componentes reutilizáveis 
│   ├── pages/        # Páginas da aplicação 
│   ├── contexts/     # Contextos globais (autenticação, carrinho, gamificação) 
│   ├── hooks/        # Hooks customizados 
├── supabase/ 
│   └── migrations/   # Scripts de migração do banco de dados 
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
