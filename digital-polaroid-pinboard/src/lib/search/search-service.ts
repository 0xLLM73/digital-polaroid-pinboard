import { createClient } from '@/lib/supabase/client';
import type { Member } from '@/lib/supabase/types';

export interface SearchQuery {
  text: string;
  filters?: {
    pin_color?: string[];
    company?: string[];
    role?: string[];
  };
  sort?: {
    field: 'relevance' | 'name' | 'company' | 'role' | 'updated_at';
    direction: 'asc' | 'desc';
  };
  pagination?: {
    limit: number;
    offset: number;
  };
}

export interface SearchResult {
  members: Member[];
  total: number;
  hasMore: boolean;
  suggestions?: string[];
  facets?: {
    companies: Array<{ name: string; count: number }>;
    roles: Array<{ name: string; count: number }>;
    pinColors: Array<{ color: string; count: number }>;
  };
  searchTime: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'name' | 'role' | 'company' | 'skill';
  count: number;
}

export class SearchService {
  private supabase = createClient();
  private searchCache = new Map<string, { result: SearchResult; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async search(query: SearchQuery): Promise<{ data?: SearchResult; error?: string }> {
    const startTime = performance.now();
    
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(query);
      const cached = this.searchCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return { data: cached.result };
      }

      // Build search query
      let searchQuery = this.supabase
        .from('members')
        .select('*', { count: 'exact' })
        .eq('public_visibility', true);

      // Apply text search
      if (query.text.trim()) {
        const searchTerms = this.preprocessSearchText(query.text);
        searchQuery = searchQuery.textSearch('search_vector', searchTerms);
      }

      // Apply filters
      if (query.filters?.pin_color?.length) {
        searchQuery = searchQuery.in('pin_color', query.filters.pin_color);
      }
      
      if (query.filters?.company?.length) {
        searchQuery = searchQuery.in('company', query.filters.company);
      }
      
      if (query.filters?.role?.length) {
        searchQuery = searchQuery.in('role', query.filters.role);
      }

      // Apply sorting
      const sortField = query.sort?.field || 'relevance';
      const sortDirection = query.sort?.direction || 'desc';
      
      if (sortField === 'relevance' && query.text.trim()) {
        // Use text search ranking for relevance
        searchQuery = searchQuery.order('search_vector', { ascending: false });
      } else if (sortField !== 'relevance') {
        searchQuery = searchQuery.order(sortField, { ascending: sortDirection === 'asc' });
      }

      // Apply pagination
      const limit = query.pagination?.limit || 20;
      const offset = query.pagination?.offset || 0;
      searchQuery = searchQuery.range(offset, offset + limit - 1);

      // Execute search
      const { data: members, error, count } = await searchQuery;

      if (error) {
        console.error('Search error:', error);
        return { error: 'Search failed. Please try again.' };
      }

      // Get search suggestions and facets
      const [suggestions, facets] = await Promise.all([
        this.getSearchSuggestions(query.text),
        this.getSearchFacets(query),
      ]);

      const searchTime = performance.now() - startTime;
      const total = count || 0;
      const hasMore = offset + limit < total;

      const result: SearchResult = {
        members: members || [],
        total,
        hasMore,
        suggestions,
        facets,
        searchTime,
      };

      // Cache result
      this.searchCache.set(cacheKey, {
        result,
        timestamp: Date.now(),
      });

      // Clean old cache entries
      this.cleanCache();

      return { data: result };
    } catch (error) {
      console.error('Unexpected search error:', error);
      return { error: 'An unexpected error occurred during search.' };
    }
  }

  async getSearchSuggestions(text: string): Promise<string[]> {
    if (!text.trim() || text.length < 2) return [];

    try {
      // Get suggestions from member names, roles, and companies
      const { data, error } = await this.supabase
        .from('members')
        .select('name, role, company')
        .eq('public_visibility', true)
        .limit(100);

      if (error || !data) return [];

      const suggestions = new Set<string>();
      const searchTerm = text.toLowerCase();

      data.forEach(member => {
        // Name suggestions
        if (member.name?.toLowerCase().includes(searchTerm)) {
          suggestions.add(member.name);
        }

        // Role suggestions
        if (member.role?.toLowerCase().includes(searchTerm)) {
          suggestions.add(member.role);
        }

        // Company suggestions
        if (member.company?.toLowerCase().includes(searchTerm)) {
          suggestions.add(member.company);
        }
      });

      return Array.from(suggestions)
        .sort((a, b) => {
          // Prioritize exact matches
          const aExact = a.toLowerCase().startsWith(searchTerm);
          const bExact = b.toLowerCase().startsWith(searchTerm);
          
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          
          return a.localeCompare(b);
        })
        .slice(0, 5);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }

  async getSearchFacets(query: SearchQuery): Promise<SearchResult['facets']> {
    try {
      let facetQuery = this.supabase
        .from('members')
        .select('company, role, pin_color')
        .eq('public_visibility', true);

      // Apply text search to facets if present
      if (query.text.trim()) {
        const searchTerms = this.preprocessSearchText(query.text);
        facetQuery = facetQuery.textSearch('search_vector', searchTerms);
      }

      const { data, error } = await facetQuery;

      if (error || !data) return undefined;

      // Count facets
      const companies = new Map<string, number>();
      const roles = new Map<string, number>();
      const pinColors = new Map<string, number>();

      data.forEach(member => {
        if (member.company) {
          companies.set(member.company, (companies.get(member.company) || 0) + 1);
        }
        if (member.role) {
          roles.set(member.role, (roles.get(member.role) || 0) + 1);
        }
        if (member.pin_color) {
          pinColors.set(member.pin_color, (pinColors.get(member.pin_color) || 0) + 1);
        }
      });

      return {
        companies: Array.from(companies.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        roles: Array.from(roles.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        pinColors: Array.from(pinColors.entries())
          .map(([color, count]) => ({ color, count }))
          .sort((a, b) => b.count - a.count),
      };
    } catch (error) {
      console.error('Error getting search facets:', error);
      return undefined;
    }
  }

  private preprocessSearchText(text: string): string {
    // Clean and prepare search text for PostgreSQL full-text search
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .split(' ')
      .filter(word => word.length > 1) // Remove single characters
      .map(word => `${word}:*`) // Add prefix matching
      .join(' & '); // Use AND operator
  }

  private generateCacheKey(query: SearchQuery): string {
    return JSON.stringify({
      text: query.text,
      filters: query.filters,
      sort: query.sort,
      pagination: query.pagination,
    });
  }

  private cleanCache(): void {
    const now = Date.now();
    for (const [key, value] of this.searchCache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.searchCache.delete(key);
      }
    }
  }

  clearCache(): void {
    this.searchCache.clear();
  }
}

export const searchService = new SearchService();