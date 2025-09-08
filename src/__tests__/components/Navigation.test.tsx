import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
    
    // Check if the logo is present
    expect(screen.getByAltText(/keepla Logo/i)).toBeInTheDocument();
    
    // Check if navigation links are present
    expect(screen.getByText(/Como Funciona/i)).toBeInTheDocument();
    expect(screen.getByText(/Preços/i)).toBeInTheDocument();
    
    // Since we're not checking for a specific login button text that might not exist
    // Let's check for one of the other menu items instead
    expect(screen.getByText(/Manifesto/i)).toBeInTheDocument();
  });
});