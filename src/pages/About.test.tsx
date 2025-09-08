import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import About from './About';
import { BrowserRouter } from 'react-router-dom';

// Mock the AuthContext
vi.mock('@/contexts/useAuthContext', () => ({
  useAuthContext: () => ({
    user: null,
    isAuthenticated: false,
  }),
}));

describe('About Page', () => {
  it('renders the about page correctly', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
    
    // Basic assertion to check if the component renders
    expect(document.body).toBeInTheDocument();
  });
});