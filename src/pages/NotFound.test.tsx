import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import NotFound from './NotFound';
import { BrowserRouter } from 'react-router-dom';

describe('NotFound Page', () => {
  it('renders the not found page correctly', () => {
    const { getByText } = render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    
    // Check if the page contains the 404 message
    expect(getByText(/404/i)).toBeInTheDocument();
    expect(getByText(/Oops! Page not found/i)).toBeInTheDocument();
    
    // Check if there's a link to go back to home
    const homeLink = getByText(/Return to Home/i);
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });
});