import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from './NotFound';
import { describe, it, expect } from 'vitest';

describe('NotFound Page', () => {
  it('renders the not found page correctly', () => {
    const { getByText } = render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(
      getByText(/memória não encontrada/i)
    ).toBeInTheDocument();
  });
});