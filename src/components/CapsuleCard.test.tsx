
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CapsuleCard from './CapsuleCard';
import { describe, it, expect } from 'vitest';

interface CapsuleCardProps {
  id: string;
  title: string;
  description: string;
  deliveryDate: string;
  status: "pending" | "delivered" | "scheduled";
  type: "email" | "physical" | "digital";
  recipient: string;
}

describe('CapsuleCard', () => {
  it('should render the component with provided title', () => {
    const mockProps: CapsuleCardProps = {
      id: '1',
      title: 'Minha Cápsula de Teste',
      description: 'Esta é uma descrição de teste.',
      deliveryDate: '2025-12-31',
      status: 'scheduled',
      type: 'digital',
      recipient: 'test@example.com',
    };
    render(<CapsuleCard {...mockProps} />);
    expect(screen.getByText('Minha Cápsula de Teste')).toBeInTheDocument();
  });
});
