# Testes E2E com Cypress

1. Instale o Cypress:

   ```sh
   npm install --save-dev cypress
   ```

2. Adicione o script ao package.json:

   ```json
   "scripts": {
     ...
     "cypress:open": "cypress open"
   }
   ```

3. Inicie o Cypress:

   ```sh
   npm run cypress:open
   ```

4. Exemplo de teste (crie em cypress/e2e/primeiro-teste.cy.js):

   ```js
   describe('Página inicial', () => {
     it('deve mostrar o título', () => {
       cy.visit('/');
       cy.contains('keeplar');
     });
   });
   ```

5. Consulte a [documentação oficial do Cypress](https://docs.cypress.io/) para mais exemplos.
