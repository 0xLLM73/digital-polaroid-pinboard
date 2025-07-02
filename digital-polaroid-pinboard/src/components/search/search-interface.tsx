'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, Clock, TrendingUp } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { searchService } from '@/lib/search/search-service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { SearchQuery, SearchResult } from '@/lib/search/search-service';

interface SearchInterfaceProps {
  onResults: (results: SearchResult) => void;
  onLoading: (loading: boolean) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

export function SearchInterface({
  onResults,
  onLoading,
  placeholder = "Search members by name, role, or company...",
  showFilters = true,
  className = '',
}: SearchInterfaceProps) {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce search text to avoid excessive API calls
  const debouncedSearchText = useDebounce(searchText, 300);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('search-history');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }, []);

  // Perform search when debounced text changes
  useEffect(() => {
    if (debouncedSearchText.trim()) {
      performSearch(debouncedSearchText);
    } else {
      // Clear results when search is empty
      onResults({
        members: [],
        total: 0,
        hasMore: false,
        searchTime: 0,
      });
    }
  }, [debouncedSearchText]);

  // Get suggestions when search text changes
  useEffect(() => {
    if (searchText.trim() && searchText.length >= 2) {
      getSuggestions(searchText);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchText]);

  const performSearch = useCallback(async (text: string) => {
    setIsSearching(true);
    onLoading(true);

    try {
      const query: SearchQuery = {
        text,
        pagination: { limit: 20, offset: 0 },
        sort: { field: 'relevance', direction: 'desc' },
      };

      const result = await searchService.search(query);

      if (result.error) {
        console.error('Search error:', result.error);
        // Show error state
        onResults({
          members: [],
          total: 0,
          hasMore: false,
          searchTime: 0,
        });
      } else if (result.data) {
        onResults(result.data);
        
        // Add to search history
        if (text.trim()) {
          addToSearchHistory(text.trim());
        }
      }
    } catch (error) {
      console.error('Unexpected search error:', error);
    } finally {
      setIsSearching(false);
      onLoading(false);
    }
  }, [onResults, onLoading]);

  const getSuggestions = useCallback(async (text: string) => {
    try {
      const suggestions = await searchService.getSearchSuggestions(text);
      setSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
      setSelectedSuggestion(-1);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const addToSearchHistory = (text: string) => {
    const newHistory = [text, ...searchHistory.filter(item => item !== text)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          selectSuggestion(suggestions[selectedSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchText(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
    searchInputRef.current?.focus();
  };

  const clearSearch = () => {
    setSearchText('');
    setSuggestions([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-muted" />
        </div>
        
        <Input
          ref={searchInputRef}
          type="text"
          value={searchText}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-20 py-3 text-lg bg-polaroid-white border-cork-light focus:border-cork-brown focus:ring-cork-brown/20"
          aria-label="Search members"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          role="combobox"
        />

        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
          {isSearching && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 border-2 border-cork-brown border-t-transparent rounded-full"
            />
          )}
          
          {searchText && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-6 w-6 p-0 hover:bg-cork-light/20"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {showFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-cork-light/20"
              aria-label="Search filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-polaroid-white border border-cork-light rounded-lg shadow-polaroid z-50 max-h-64 overflow-y-auto"
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => selectSuggestion(suggestion)}
                className={`w-full text-left px-4 py-3 hover:bg-cork-light/10 focus:bg-cork-light/20 focus:outline-none transition-colors ${
                  index === selectedSuggestion ? 'bg-cork-light/20' : ''
                }`}
                role="option"
                aria-selected={index === selectedSuggestion}
              >
                <div className="flex items-center space-x-3">
                  <Search className="h-4 w-4 text-text-muted flex-shrink-0" />
                  <span className="text-text-primary font-handwritten">
                    {suggestion}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search History (when input is focused and empty) */}
      <AnimatePresence>
        {showSuggestions && !searchText && searchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-polaroid-white border border-cork-light rounded-lg shadow-polaroid z-50"
          >
            <div className="px-4 py-2 border-b border-cork-light/30">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-text-muted" />
                <span className="text-sm font-medium text-text-secondary">
                  Recent Searches
                </span>
              </div>
            </div>
            
            {searchHistory.slice(0, 5).map((item, index) => (
              <button
                key={item}
                onClick={() => selectSuggestion(item)}
                className="w-full text-left px-4 py-2 hover:bg-cork-light/10 focus:bg-cork-light/20 focus:outline-none transition-colors"
              >
                <span className="text-text-primary font-handwritten">
                  {item}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}