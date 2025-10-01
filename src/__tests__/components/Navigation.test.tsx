import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Navigation from '@/components/Navigation';
import { BrowserRouter } from 'react-router-dom';

// Mock the AuthContext
vi.mock('@/contexts/useAuthContext', () => ({
  useAuthContext: () => ({
    user: null,
    isAuthenticated: false,
  }),
}));

describe('Navigation Component', () => {
  it('renders the navigation component correctly', () => {
    const { getByAltText, getByText } = render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
    
    // Check if the logo is present
    expect(getByAltText(/keepla Logo/i)).toBeInTheDocument();
    
    // Check if navigation links are present
    expect(getByText(/Como Funciona/i)).toBeInTheDocument();
    expect(getByText(/Preços/i)).toBeInTheDocument();
    
    // Check for one of the other menu items
    expect(getByText(/Manifesto/i)).toBeInTheDocument();
  });
});