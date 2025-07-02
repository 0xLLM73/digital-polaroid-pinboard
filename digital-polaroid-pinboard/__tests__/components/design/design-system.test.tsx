import { render, screen } from '@testing-library/react';
import { CorkBoardBackground } from '@/components/design/cork-board-background';
import { Typography } from '@/components/design/typography';
import { PolaroidCard } from '@/components/polaroid/polaroid-card';

describe('Design System Components', () => {
  const mockMember = {
    id: '1',
    user_id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Designer',
    company: 'Acme Corp',
    bio: 'Creative professional',
    photo_url: undefined,
    pin_color: 'cherry' as const,
    public_visibility: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  };

  test('CorkBoardBackground renders with children', () => {
    render(
      <CorkBoardBackground>
        <div data-testid="child-content">Test Content</div>
      </CorkBoardBackground>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  test('Typography renders with correct variants', () => {
    render(
      <div>
        <Typography variant="display-large" data-testid="display">
          Display Text
        </Typography>
        <Typography variant="handwritten-medium" data-testid="handwritten">
          Handwritten Text
        </Typography>
        <Typography variant="body-medium" data-testid="body">
          Body Text
        </Typography>
      </div>
    );

    expect(screen.getByTestId('display')).toHaveClass('font-display');
    expect(screen.getByTestId('handwritten')).toHaveClass('font-handwritten');
    expect(screen.getByTestId('body')).toHaveClass('font-sans');
  });

  test('PolaroidCard renders member information correctly', () => {
    render(<PolaroidCard member={mockMember} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  test('PolaroidCard applies correct pin color', () => {
    const { container } = render(<PolaroidCard member={mockMember} />);
    
    const pinElement = container.querySelector('.bg-pin-cherry-500');
    expect(pinElement).toBeInTheDocument();
  });

  test('PolaroidCard handles different sizes', () => {
    const { rerender, container } = render(
      <PolaroidCard member={mockMember} size="small" />
    );
    
    expect(container.querySelector('.w-48')).toBeInTheDocument();

    rerender(<PolaroidCard member={mockMember} size="large" />);
    expect(container.querySelector('.w-80')).toBeInTheDocument();
  });
});