import { createClient } from '@/lib/supabase/client';

export interface SearchEvent {
  query: string;
  results_count: number;
  search_time: number;
  user_id?: string;
  session_id: string;
  timestamp: Date;
  filters_used?: string[];
  result_clicked?: boolean;
  click_position?: number;
}

export interface SearchAnalytics {
  total_searches: number;
  unique_queries: number;
  average_results: number;
  average_search_time: number;
  popular_queries: Array<{ query: string; count: number }>;
  popular_filters: Array<{ filter: string; count: number }>;
  click_through_rate: number;
  zero_result_queries: Array<{ query: string; count: number }>;
}

export class SearchAnalyticsService {
  private supabase = createClient();
  private sessionId: string;
  private eventQueue: SearchEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startEventFlush();
  }

  async trackSearch(event: Omit<SearchEvent, 'session_id' | 'timestamp'>): Promise<void> {
    const searchEvent: SearchEvent = {
      ...event,
      session_id: this.sessionId,
      timestamp: new Date(),
    };

    // Add to queue for batch processing
    this.eventQueue.push(searchEvent);

    // Flush immediately if queue is large
    if (this.eventQueue.length >= 10) {
      await this.flushEvents();
    }
  }

  async trackSearchClick(
    query: string,
    position: number,
    memberId: string
  ): Promise<void> {
    await this.trackSearch({
      query,
      results_count: 0, // Not relevant for click events
      search_time: 0, // Not relevant for click events
      result_clicked: true,
      click_position: position,
    });
  }

  async getSearchAnalytics(
    startDate?: Date,
    endDate?: Date
  ): Promise<{ data?: SearchAnalytics; error?: string }> {
    try {
      // This would typically query a dedicated analytics table
      // For now, we'll return mock data structure
      const analytics: SearchAnalytics = {
        total_searches: 0,
        unique_queries: 0,
        average_results: 0,
        average_search_time: 0,
        popular_queries: [],
        popular_filters: [],
        click_through_rate: 0,
        zero_result_queries: [],
      };

      return { data: analytics };
    } catch (error) {
      console.error('Error getting search analytics:', error);
      return { error: 'Failed to retrieve search analytics' };
    }
  }

  async getPopularSearches(limit: number = 10): Promise<string[]> {
    try {
      // This would query analytics data
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error getting popular searches:', error);
      return [];
    }
  }

  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    try {
      // In a real implementation, this would send events to an analytics service
      // For now, we'll just log them
      console.log('Flushing search events:', this.eventQueue);
      
      // Clear the queue
      this.eventQueue = [];
    } catch (error) {
      console.error('Error flushing search events:', error);
    }
  }

  private startEventFlush(): void {
    // Flush events every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, 30000);
  }

  private generateSessionId(): string {
    return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushEvents(); // Final flush
  }
}

export const searchAnalyticsService = new SearchAnalyticsService();