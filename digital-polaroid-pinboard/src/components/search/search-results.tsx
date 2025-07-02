'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PolaroidCard } from '@/components/polaroid/polaroid-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Typography } from '@/components/design/typography';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Filter } from 'lucide-react';
import { searchAnalyticsService } from '@/lib/search/search-analytics';
import type { SearchResult, Member } from '@/lib/search/search-service';

interface SearchResultsProps {
  results: SearchResult;
  loading: boolean;
  onLoadMore?: () => void;
  onMemberClick?: (member: Member, position: number) => void;
  query?: string;
  className?: string;
}

export function SearchResults({
  results,
  loading,
  onLoadMore,
  onMemberClick,
  query = '',
  className = '',
}: SearchResultsProps) {
  const [displayedMembers, setDisplayedMembers] = useState<Member[]>([]);

  useEffect(() => {
    setDisplayedMembers(results.members);
  }, [results.members]);

  const handleMemberClick = (member: Member, index: number) => {
    // Track click analytics
    if (query) {
      searchAnalyticsService.trackSearchClick(query, index, member.id);
    }
    
    onMemberClick?.(member, index);
  };

  const formatSearchTime = (time: number): string => {
    if (time < 1000) {
      return `${Math.round(time)}ms`;
    }
    return `${(time / 1000).toFixed(2)}s`;
  };

  if (loading && displayedMembers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 border-4 border-cork-brown border-t-transparent rounded-full"
        />
        <Typography variant="handwritten-medium" color="secondary">
          Searching through the directory...
        </Typography>
      </div>
    );
  }

  if (!loading && displayedMembers.length === 0 && query) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 space-y-6"
      >
        <div className="relative">
          <Search className="h-16 w-16 text-text-muted" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-2 -right-2 h-6 w-6 bg-pin-cherry rounded-full flex items-center justify-center"
          >
            <span className="text-xs text-white font-bold">0</span>
          </motion.div>
        </div>
        
        <div className="text-center space-y-2">
          <Typography variant="handwritten-large" color="primary">
            No members found
          </Typography>
          <Typography variant="body-medium" color="secondary">
            We couldn't find any members matching "{query}"
          </Typography>
        </div>

        <div className="bg-polaroid-cream border border-cork-light rounded-lg p-6 max-w-md">
          <Typography variant="label-medium" color="secondary" className="mb-3">
            Try these suggestions:
          </Typography>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>• Check your spelling</li>
            <li>• Use different keywords</li>
            <li>• Try searching by role or company</li>
            <li>• Use fewer words in your search</li>
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Results Header */}
      {query && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cork-light/30"
        >
          <div>
            <Typography variant="handwritten-large" color="primary">
              {results.total} member{results.total !== 1 ? 's' : ''} found
            </Typography>
            <Typography variant="body-small" color="secondary">
              Search completed in {formatSearchTime(results.searchTime)}
            </Typography>
          </div>

          {results.facets && (
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Search Results Grid */}
      <ResponsiveGrid variant="polaroids" gap="medium">
        <AnimatePresence mode="popLayout">
          {displayedMembers.map((member, index) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                layout: { duration: 0.3 }
              }}
            >
              <PolaroidCard
                member={member}
                onClick={() => handleMemberClick(member, index)}
                rotation={Math.random() * 6 - 3} // Random rotation between -3 and 3 degrees
                size="medium"
                interactive={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </ResponsiveGrid>

      {/* Load More Button */}
      {results.hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-8"
        >
          <Button
            onClick={onLoadMore}
            disabled={loading}
            variant="nostalgic"
            size="lg"
            className="px-8"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading more...
              </>
            ) : (
              'Load More Members'
            )}
          </Button>
        </motion.div>
      )}

      {/* Search Facets */}
      {results.facets && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 bg-polaroid-cream border border-cork-light rounded-lg"
        >
          <Typography variant="handwritten-medium" color="primary" className="mb-4">
            Refine your search
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Companies */}
            {results.facets.companies.length > 0 && (
              <div>
                <Typography variant="label-medium" color="secondary" className="mb-2">
                  Companies
                </Typography>
                <div className="space-y-1">
                  {results.facets.companies.slice(0, 5).map(company => (
                    <button
                      key={company.name}
                      className="flex items-center justify-between w-full text-left p-2 rounded hover:bg-cork-light/20 transition-colors"
                    >
                      <span className="text-sm text-text-primary">{company.name}</span>
                      <span className="text-xs text-text-muted bg-cork-light/30 px-2 py-1 rounded-full">
                        {company.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Roles */}
            {results.facets.roles.length > 0 && (
              <div>
                <Typography variant="label-medium" color="secondary" className="mb-2">
                  Roles
                </Typography>
                <div className="space-y-1">
                  {results.facets.roles.slice(0, 5).map(role => (
                    <button
                      key={role.name}
                      className="flex items-center justify-between w-full text-left p-2 rounded hover:bg-cork-light/20 transition-colors"
                    >
                      <span className="text-sm text-text-primary">{role.name}</span>
                      <span className="text-xs text-text-muted bg-cork-light/30 px-2 py-1 rounded-full">
                        {role.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pin Colors */}
            {results.facets.pinColors.length > 0 && (
              <div>
                <Typography variant="label-medium" color="secondary" className="mb-2">
                  Pin Colors
                </Typography>
                <div className="space-y-1">
                  {results.facets.pinColors.map(pinColor => (
                    <button
                      key={pinColor.color}
                      className="flex items-center justify-between w-full text-left p-2 rounded hover:bg-cork-light/20 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full bg-pin-${pinColor.color}`} />
                        <span className="text-sm text-text-primary capitalize">
                          {pinColor.color}
                        </span>
                      </div>
                      <span className="text-xs text-text-muted bg-cork-light/30 px-2 py-1 rounded-full">
                        {pinColor.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}