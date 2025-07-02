import { searchService } from '@/lib/search/search-service';
import type { SearchQuery } from '@/lib/search/search-service';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      textSearch: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    })),
  }),
}));

describe('SearchService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    searchService.clearCache();
  });

  test('should perform basic text search', async () => {
    const mockMembers = [
      {
        id: '1',
        user_id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Developer',
        company: 'Tech Corp',
        pin_color: 'cherry',
        public_visibility: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    ];

    const mockSupabase = require('@/lib/supabase/client').createClient();
    mockSupabase.from().range.mockResolvedValue({
      data: mockMembers,
      error: null,
      count: 1,
    });

    const query: SearchQuery = {
      text: 'John',
      pagination: { limit: 20, offset: 0 },
    };

    const result = await searchService.search(query);

    expect(result.error).toBeUndefined();
    expect(result.data?.members).toEqual(mockMembers);
    expect(result.data?.total).toBe(1);
  });

  test('should handle search with filters', async () => {
    const mockSupabase = require('@/lib/supabase/client').createClient();
    mockSupabase.from().range.mockResolvedValue({
      data: [],
      error: null,
      count: 0,
    });

    const query: SearchQuery = {
      text: 'developer',
      filters: {
        pin_color: ['cherry', 'teal'],
        company: ['Tech Corp'],
      },
      pagination: { limit: 20, offset: 0 },
    };

    await searchService.search(query);

    expect(mockSupabase.from().in).toHaveBeenCalledWith('pin_color', ['cherry', 'teal']);
    expect(mockSupabase.from().in).toHaveBeenCalledWith('company', ['Tech Corp']);
  });

  test('should cache search results', async () => {
    const mockMembers = [{ id: '1', name: 'John Doe' }];
    const mockSupabase = require('@/lib/supabase/client').createClient();
    mockSupabase.from().range.mockResolvedValue({
      data: mockMembers,
      error: null,
      count: 1,
    });

    const query: SearchQuery = {
      text: 'John',
      pagination: { limit: 20, offset: 0 },
    };

    // First search
    await searchService.search(query);
    
    // Second search (should use cache)
    const result = await searchService.search(query);

    expect(result.data?.members).toEqual(mockMembers);
    // Verify that the database was only called once
    expect(mockSupabase.from().range).toHaveBeenCalledTimes(1);
  });

  test('should get search suggestions', async () => {
    const mockMembers = [
      { name: 'John Doe', role: 'Developer', company: 'Tech Corp' },
      { name: 'Jane Smith', role: 'Designer', company: 'Design Studio' },
    ];

    const mockSupabase = require('@/lib/supabase/client').createClient();
    mockSupabase.from().limit.mockResolvedValue({
      data: mockMembers,
      error: null,
    });

    const suggestions = await searchService.getSearchSuggestions('dev');

    expect(suggestions).toContain('Developer');
    expect(suggestions.length).toBeLessThanOrEqual(5);
  });

  test('should handle search errors gracefully', async () => {
    const mockSupabase = require('@/lib/supabase/client').createClient();
    mockSupabase.from().range.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
      count: 0,
    });

    const query: SearchQuery = {
      text: 'test',
      pagination: { limit: 20, offset: 0 },
    };

    const result = await searchService.search(query);

    expect(result.error).toBeDefined();
    expect(result.data).toBeUndefined();
  });

  test('should preprocess search text correctly', async () => {
    const mockSupabase = require('@/lib/supabase/client').createClient();
    mockSupabase.from().range.mockResolvedValue({
      data: [],
      error: null,
      count: 0,
    });

    const query: SearchQuery = {
      text: 'John & Jane!',
      pagination: { limit: 20, offset: 0 },
    };

    await searchService.search(query);

    expect(mockSupabase.from().textSearch).toHaveBeenCalledWith(
      'search_vector',
      'john:* & jane:*'
    );
  });

  test('should generate search facets', async () => {
    const mockSupabase = require('@/lib/supabase/client').createClient();
    mockSupabase.from().range.mockResolvedValue({
      data: [],
      error: null,
      count: 0,
    });

    const mockFacetData = [
      { company: 'Tech Corp', role: 'Developer', pin_color: 'cherry' },
      { company: 'Tech Corp', role: 'Designer', pin_color: 'teal' },
      { company: 'Design Studio', role: 'Designer', pin_color: 'cherry' },
    ];

    // Mock the facet query
    mockSupabase.from().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      textSearch: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({
        data: mockFacetData,
        error: null,
      }),
    });

    const query: SearchQuery = {
      text: 'test',
      pagination: { limit: 20, offset: 0 },
    };

    const facets = await searchService.getSearchFacets(query);

    expect(facets).toBeDefined();
    expect(facets?.companies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Tech Corp', count: 2 }),
        expect.objectContaining({ name: 'Design Studio', count: 1 }),
      ])
    );
  });

  test('should handle pagination correctly', async () => {
    const mockSupabase = require('@/lib/supabase/client').createClient();
    mockSupabase.from().range.mockResolvedValue({
      data: [],
      error: null,
      count: 100,
    });

    const query: SearchQuery = {
      text: 'test',
      pagination: { limit: 10, offset: 20 },
    };

    await searchService.search(query);

    expect(mockSupabase.from().range).toHaveBeenCalledWith(20, 29);
  });

  test('should handle empty search text', async () => {
    const mockSupabase = require('@/lib/supabase/client').createClient();
    mockSupabase.from().range.mockResolvedValue({
      data: [],
      error: null,
      count: 0,
    });

    const query: SearchQuery = {
      text: '',
      pagination: { limit: 20, offset: 0 },
    };

    await searchService.search(query);

    expect(mockSupabase.from().textSearch).not.toHaveBeenCalled();
  });

  test('should apply sorting correctly', async () => {
    const mockSupabase = require('@/lib/supabase/client').createClient();
    mockSupabase.from().range.mockResolvedValue({
      data: [],
      error: null,
      count: 0,
    });

    const query: SearchQuery = {
      text: 'test',
      sort: { field: 'name', direction: 'asc' },
      pagination: { limit: 20, offset: 0 },
    };

    await searchService.search(query);

    expect(mockSupabase.from().order).toHaveBeenCalledWith('name', { ascending: true });
  });
});