-- dialect: postgresql

{
  "compilerOptions": {
    "types": ["jest"]
  }
}

describe('Fluxo principal do utilizador', () => {
  it('deve permitir login e navegar até ao dashboard', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('utilizador@teste.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard');
  });
});
