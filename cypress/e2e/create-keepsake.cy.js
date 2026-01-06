/**
 * Testes E2E para o fluxo completo de criação de Keepsake
 * Cobre: autenticação → criação → agendamento → confirmação
 */

describe('Fluxo completo de criação de Keepsake', () => {
  const testUser = {
    email: 'utilizador@teste.com',
    password: 'password123'
  };

  const keepsakeData = {
    title: 'Memória de Teste E2E',
    message: 'Esta é uma mensagem de teste para validar o fluxo completo de criação de keepsake.',
    recipientName: 'Destinatário Teste',
    recipientEmail: 'destinatario@teste.com',
    deliveryDate: '2025-12-25'
  };

  beforeEach(() => {
    // Login antes de cada teste
    cy.visit('/login');
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('deve navegar até à página de criação de keepsake', () => {
    cy.visit('/criar-keepsake');
    cy.url().should('include', '/criar-keepsake');
    cy.contains(/criar|nova|keepsake/i).should('be.visible');
  });

  it('deve permitir preencher o formulário de keepsake passo a passo', () => {
    cy.visit('/criar-keepsake');

    // Passo 1: Tipo de entrega
    cy.get('[data-testid="delivery-type-digital"]').should('exist').click();
    cy.get('[data-testid="next-step"]').click();

    // Passo 2: Mensagem
    cy.get('input[name="title"]').type(keepsakeData.title);
    cy.get('textarea[name="message"]').type(keepsakeData.message);
    cy.get('[data-testid="next-step"]').click();

    // Passo 3: Destinatário
    cy.get('input[name="recipientName"]').type(keepsakeData.recipientName);
    cy.get('input[name="recipientEmail"]').type(keepsakeData.recipientEmail);
    cy.get('[data-testid="next-step"]').click();

    // Passo 4: Data de entrega
    cy.get('input[name="deliveryDate"]').type(keepsakeData.deliveryDate);
    cy.get('[data-testid="next-step"]').click();

    // Passo 5: Revisão e confirmação
    cy.contains(keepsakeData.title).should('be.visible');
    cy.contains(keepsakeData.recipientName).should('be.visible');
  });

  it('deve exibir erro se campos obrigatórios estiverem vazios', () => {
    cy.visit('/criar-keepsake');

    // Tenta avançar sem preencher campos
    cy.get('[data-testid="next-step"]').click();
    
    // Deve mostrar mensagem de erro ou permanecer no mesmo passo
    cy.url().should('include', '/criar-keepsake');
  });

  it('deve validar formato de email do destinatário', () => {
    cy.visit('/criar-keepsake');

    // Avança até ao passo de destinatário
    cy.get('[data-testid="delivery-type-digital"]').click();
    cy.get('[data-testid="next-step"]').click();
    
    cy.get('input[name="title"]').type(keepsakeData.title);
    cy.get('textarea[name="message"]').type(keepsakeData.message);
    cy.get('[data-testid="next-step"]').click();

    // Insere email inválido
    cy.get('input[name="recipientName"]').type(keepsakeData.recipientName);
    cy.get('input[name="recipientEmail"]').type('email-invalido');
    cy.get('[data-testid="next-step"]').click();

    // Deve mostrar erro de validação
    cy.contains(/email|inválido|formato/i).should('be.visible');
  });

  it('deve permitir criar keepsake digital com sucesso', () => {
    cy.visit('/criar-keepsake');

    // Fluxo completo de criação
    cy.get('[data-testid="delivery-type-digital"]').click();
    cy.get('[data-testid="next-step"]').click();

    cy.get('input[name="title"]').type(keepsakeData.title);
    cy.get('textarea[name="message"]').type(keepsakeData.message);
    cy.get('[data-testid="next-step"]').click();

    cy.get('input[name="recipientName"]').type(keepsakeData.recipientName);
    cy.get('input[name="recipientEmail"]').type(keepsakeData.recipientEmail);
    cy.get('[data-testid="next-step"]').click();

    cy.get('input[name="deliveryDate"]').type(keepsakeData.deliveryDate);
    cy.get('[data-testid="next-step"]').click();

    // Confirma criação
    cy.get('[data-testid="confirm-keepsake"]').click();

    // Deve redirecionar para dashboard ou mostrar sucesso
    cy.contains(/sucesso|criado|agendado/i).should('be.visible');
  });

  it('deve mostrar keepsake criada no dashboard', () => {
    // Assumindo que já existe uma keepsake criada
    cy.visit('/dashboard');
    
    // Deve listar keepsakes do utilizador
    cy.get('[data-testid="keepsakes-list"]').should('exist');
  });
});

describe('Fluxo de edição de Keepsake', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('utilizador@teste.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('deve permitir editar uma keepsake existente', () => {
    cy.visit('/dashboard');
    
    // Clica para editar a primeira keepsake
    cy.get('[data-testid="edit-keepsake"]').first().click();
    
    // Deve navegar para página de edição
    cy.url().should('include', '/editar-keepsake');
    
    // Altera a mensagem
    cy.get('textarea[name="message"]').clear().type('Mensagem atualizada via teste E2E');
    cy.get('[data-testid="save-keepsake"]').click();
    
    // Deve mostrar sucesso
    cy.contains(/atualizado|guardado|sucesso/i).should('be.visible');
  });

  it('deve permitir cancelar uma keepsake pendente', () => {
    cy.visit('/dashboard');
    
    // Clica para cancelar a primeira keepsake pendente
    cy.get('[data-testid="cancel-keepsake"]').first().click();
    
    // Confirma cancelamento
    cy.get('[data-testid="confirm-cancel"]').click();
    
    // Deve mostrar confirmação
    cy.contains(/cancelado|removido/i).should('be.visible');
  });
});

describe('Verificação de status de Keepsake', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('utilizador@teste.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
  });

  it('deve exibir diferentes estados de keepsake corretamente', () => {
    cy.visit('/dashboard');
    
    // Verifica se os badges de status existem
    cy.get('[data-testid="keepsakes-list"]').within(() => {
      // Pode ter keepsakes com diferentes estados
      cy.get('[data-testid="status-badge"]').should('exist');
    });
  });

  it('deve mostrar detalhes ao clicar numa keepsake', () => {
    cy.visit('/dashboard');
    
    cy.get('[data-testid="keepsake-card"]').first().click();
    
    // Deve mostrar modal ou página de detalhes
    cy.contains(/detalhes|mensagem|destinatário/i).should('be.visible');
  });
});
