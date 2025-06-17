describe('Fluxo de compra e pagamento', () => {
  it('deve permitir ao usuário completar o checkout', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('utilizador@teste.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    // Adiciona produto ao carrinho (ajuste conforme seu fluxo real)
    cy.visit('/produtos');
    cy.contains('Adicionar ao carrinho').first().click();
    cy.get('[data-testid="cart-button"]').click();
    cy.contains('Finalizar compra').click();

    // Preenche dados de envio
    cy.get('input[name="name"]').type('Cliente Teste');
    cy.get('input[name="address"]').type('Rua Exemplo, 123');
    cy.get('input[name="city"]').type('Lisboa');
    cy.get('input[name="postalCode"]').type('1000-001');
    cy.get('input[name="phone"]').type('912 345 678');
    cy.get('input[name="email"]').clear().type('cliente@teste.com');
    cy.get('button[type="submit"]').contains(/finalizar compra/i).click();

    // Deve ser redirecionado para Stripe ou ver link de pagamento
    cy.url().should('include', 'stripe.com').or('include', 'pagamento.exemplo.com');
  });
});
