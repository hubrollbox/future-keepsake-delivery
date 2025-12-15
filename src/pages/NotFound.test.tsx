import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from './NotFound';

describe('NotFound Page', () => {
  it('renders the not found page correctly', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/memória não encontrada/i)
    ).toBeInTheDocument();
  });
});
