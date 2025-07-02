import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInterface } from '@/components/search/search-interface';

// Mock search service
jest.mock('@/lib/search/search-service', () => ({
  searchService: {
    search: jest.fn(),
    getSearchSuggestions: jest.fn(),
  },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock hooks
jest.mock('@/hooks/use-debounce', () => ({
  useDebounce: (value: any) => value,
}));

describe('SearchInterface', () => {
  const mockOnResults = jest.fn();
  const mockOnLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
    });
  });

  test('renders search input correctly', () => {
    render(
      <SearchInterface
        onResults={mockOnResults}
        onLoading={mockOnLoading}
      />
    );

    const searchInput = screen.getByRole('combobox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', expect.stringContaining('Search members'));
  });

  test('handles text input and triggers search', async () => {
    const { searchService } = require('@/lib/search/search-service');
    searchService.search.mockResolvedValue({
      data: {
        members: [],
        total: 0,
        hasMore: false,
        searchTime: 100,
      },
    });

    render(
      <SearchInterface
        onResults={mockOnResults}
        onLoading={mockOnLoading}
      />
    );

    const searchInput = screen.getByRole('combobox');
    await userEvent.type(searchInput, 'John');

    await waitFor(() => {
      expect(searchService.search).toHaveBeenCalled();
    });
  });

  test('displays search suggestions', async () => {
    const { searchService } = require('@/lib/search/search-service');
    searchService.getSearchSuggestions.mockResolvedValue(['John Doe', 'Jane Smith']);

    render(
      <SearchInterface
        onResults={mockOnResults}
        onLoading={mockOnLoading}
      />
    );

    const searchInput = screen.getByRole('combobox');
    await userEvent.type(searchInput, 'Jo');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('handles keyboard navigation in suggestions', async () => {
    const { searchService } = require('@/lib/search/search-service');
    searchService.getSearchSuggestions.mockResolvedValue(['John Doe', 'Jane Smith']);

    render(
      <SearchInterface
        onResults={mockOnResults}
        onLoading={mockOnLoading}
      />
    );

    const searchInput = screen.getByRole('combobox');
    await userEvent.type(searchInput, 'Jo');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Test arrow down navigation
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(searchInput).toHaveValue('John Doe');
  });

  test('clears search when clear button is clicked', async () => {
    render(
      <SearchInterface
        onResults={mockOnResults}
        onLoading={mockOnLoading}
      />
    );

    const searchInput = screen.getByRole('combobox');
    await userEvent.type(searchInput, 'test');

    const clearButton = screen.getByLabelText('Clear search');
    await userEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
  });

  test('is accessible with proper ARIA attributes', () => {
    render(
      <SearchInterface
        onResults={mockOnResults}
        onLoading={mockOnLoading}
      />
    );

    const searchInput = screen.getByRole('combobox');
    expect(searchInput).toHaveAttribute('aria-label', 'Search members');
    expect(searchInput).toHaveAttribute('aria-expanded', 'false');
    expect(searchInput).toHaveAttribute('aria-haspopup', 'listbox');
  });

  test('shows loading indicator when searching', async () => {
    const { searchService } = require('@/lib/search/search-service');
    let resolveSearch: any;
    searchService.search.mockReturnValue(
      new Promise((resolve) => {
        resolveSearch = resolve;
      })
    );

    render(
      <SearchInterface
        onResults={mockOnResults}
        onLoading={mockOnLoading}
      />
    );

    const searchInput = screen.getByRole('combobox');
    await userEvent.type(searchInput, 'test');

    // Should show loading state
    expect(mockOnLoading).toHaveBeenCalledWith(true);

    // Resolve the search
    resolveSearch({
      data: {
        members: [],
        total: 0,
        hasMore: false,
        searchTime: 100,
      },
    });

    await waitFor(() => {
      expect(mockOnLoading).toHaveBeenCalledWith(false);
    });
  });

  test('handles search errors gracefully', async () => {
    const { searchService } = require('@/lib/search/search-service');
    searchService.search.mockResolvedValue({
      error: 'Search failed',
    });

    render(
      <SearchInterface
        onResults={mockOnResults}
        onLoading={mockOnLoading}
      />
    );

    const searchInput = screen.getByRole('combobox');
    await userEvent.type(searchInput, 'test');

    await waitFor(() => {
      expect(mockOnResults).toHaveBeenCalledWith({
        members: [],
        total: 0,
        hasMore: false,
        searchTime: 0,
      });
    });
  });

  test('saves and displays search history', async () => {
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue('["previous search"]'),
      setItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    const { searchService } = require('@/lib/search/search-service');
    searchService.search.mockResolvedValue({
      data: {
        members: [],
        total: 0,
        hasMore: false,
        searchTime: 100,
      },
    });

    render(
      <SearchInterface
        onResults={mockOnResults}
        onLoading={mockOnLoading}
      />
    );

    const searchInput = screen.getByRole('combobox');
    
    // Focus input to show history
    fireEvent.focus(searchInput);

    await waitFor(() => {
      expect(screen.getByText('Recent Searches')).toBeInTheDocument();
      expect(screen.getByText('previous search')).toBeInTheDocument();
    });
  });

  test('handles suggestion selection', async () => {
    const { searchService } = require('@/lib/search/search-service');
    searchService.getSearchSuggestions.mockResolvedValue(['John Doe']);

    render(
      <SearchInterface
        onResults={mockOnResults}
        onLoading={mockOnLoading}
      />
    );

    const searchInput = screen.getByRole('combobox');
    await userEvent.type(searchInput, 'Jo');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const suggestion = screen.getByText('John Doe');
    await userEvent.click(suggestion);

    expect(searchInput).toHaveValue('John Doe');
  });
});