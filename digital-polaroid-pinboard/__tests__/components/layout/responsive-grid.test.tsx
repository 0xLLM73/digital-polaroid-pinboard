import { render, screen } from '@testing-library/react';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('ResponsiveGrid', () => {
  test('renders children correctly', () => {
    render(
      <ResponsiveGrid>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ResponsiveGrid>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  test('applies correct grid classes for polaroids variant', () => {
    const { container } = render(
      <ResponsiveGrid variant="polaroids">
        <div>Child</div>
      </ResponsiveGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('grid-cols-1');
    expect(gridElement).toHaveClass('sm:grid-cols-2');
    expect(gridElement).toHaveClass('lg:grid-cols-3');
  });

  test('applies correct gap classes', () => {
    const { container } = render(
      <ResponsiveGrid gap="large">
        <div>Child</div>
      </ResponsiveGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveClass('gap-8');
  });
});