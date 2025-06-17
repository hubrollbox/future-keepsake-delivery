import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/pages/Login';

describe('Página de Login', () => {
  it('deve mostrar campos de email e password e permitir submit', async () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/palavra-passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/email/i), 'teste@exemplo.com');
    await userEvent.type(screen.getByLabelText(/palavra-passe/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    // Aqui pode-se simular/mockar o resultado do login se necessário
  });
});
