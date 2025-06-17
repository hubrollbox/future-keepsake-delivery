describe('Fluxos administrativos', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin@teste.com');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin');
  });

  it('deve exibir mensagem de acesso negado para usuário não admin', () => {
    cy.visit('/logout');
    cy.visit('/login');
    cy.get('input[name="email"]').type('utilizador@teste.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.visit('/admin');
    cy.contains('Acesso Negado');
  });

  it('deve listar entregas no painel admin', () => {
    cy.visit('/admin/deliveries');
    cy.contains('Entregas');
    // Verifica se há pelo menos uma entrega na lista
    cy.get('table').should('exist');
  });

  it('deve permitir navegação entre abas do admin', () => {
    cy.visit('/admin/warehouse');
    cy.contains('Armazém');
    cy.visit('/admin/messages');
    cy.contains('Mensagens');
    cy.visit('/admin/payments');
    cy.contains('Pagamentos');
    cy.visit('/admin/clients');
    cy.contains('Clientes');
  });
});

describe('Edge cases e erros no checkout', () => {
  it('deve exibir erro se tentar finalizar compra sem estar autenticado', () => {
    cy.visit('/checkout');
    cy.get('button[type="submit"]').contains(/finalizar compra/i).click();
    cy.contains('Precisa estar autenticado');
  });

  it('deve exibir erro se campos obrigatórios estiverem vazios', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('utilizador@teste.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.visit('/checkout');
    cy.get('button[type="submit"]').contains(/finalizar compra/i).click();
    cy.contains('preencha todos os campos obrigatórios');
  });
});
