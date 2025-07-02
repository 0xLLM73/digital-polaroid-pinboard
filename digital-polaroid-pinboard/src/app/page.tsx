'use client';

import { CorkBoardBackground } from '@/components/design/cork-board-background';
import { Typography, HandwrittenText, VintageLabel } from '@/components/design/typography';
import { PolaroidCard } from '@/components/polaroid/polaroid-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import type { Member } from '@/lib/supabase/types';

export default function Home() {
  // Sample members for demonstration
  const sampleMembers: Member[] = [
    {
      id: '1',
      user_id: 'user_1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'UX Designer',
      company: 'Design Studio',
      bio: 'Passionate about creating user-centered designs',
      photo_url: 'https://via.placeholder.com/400',
      pin_color: 'cherry',
      public_visibility: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: '2',
      user_id: 'user_2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      role: 'Full Stack Developer',
      company: 'Tech Innovations',
      bio: 'Building the future with code',
      photo_url: 'https://via.placeholder.com/400',
      pin_color: 'mustard',
      public_visibility: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: '3',
      user_id: 'user_3',
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      role: 'Product Manager',
      company: 'StartupCo',
      bio: 'Turning ideas into reality',
      photo_url: 'https://via.placeholder.com/400',
      pin_color: 'teal',
      public_visibility: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: '4',
      user_id: 'user_4',
      name: 'James Wilson',
      email: 'james@example.com',
      role: 'Marketing Director',
      company: 'Growth Agency',
      bio: 'Crafting compelling brand stories',
      photo_url: undefined,
      pin_color: 'lavender',
      public_visibility: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ];

  return (
    <CorkBoardBackground variant="medium" animated>
      <div className="min-h-screen">
        {/* Header Section */}
        <header className="p-8 text-center space-y-4">
          <Typography variant="display-large" as="h1" align="center" color="cork-dark">
            Digital Polaroid Pinboard
          </Typography>
          <HandwrittenText size="large" className="text-cork-brown">
            Stage 4: Core Visual Design System
          </HandwrittenText>
          <Typography variant="body-large" align="center" className="max-w-2xl mx-auto">
            Experience the nostalgic aesthetics of physical photo collections with our authentic cork board design, 
            polaroid-style cards, and handwritten typography.
          </Typography>
        </header>

        {/* Typography Showcase */}
        <section className="p-8 space-y-6 max-w-4xl mx-auto">
          <VintageLabel>Typography System</VintageLabel>
          
          <div className="space-y-4 bg-polaroid-white p-6 rounded-sm shadow-polaroid">
            <Typography variant="display-medium" as="h2">
              Display Typography
            </Typography>
            <Typography variant="handwritten-medium">
              Handwritten text adds a personal touch
            </Typography>
            <Typography variant="body-medium">
              Body text maintains excellent readability while complementing the nostalgic aesthetic. 
              Our typography system includes display, handwritten, body, and label variants.
            </Typography>
            <Typography variant="label-medium" color="secondary">
              LABEL TEXT FOR METADATA
            </Typography>
          </div>
        </section>

        {/* Polaroid Cards Grid */}
        <section className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <Typography variant="display-medium" as="h2" align="center">
              Member Directory
            </Typography>
            <HandwrittenText size="medium">
              Click and drag the cards to rearrange them!
            </HandwrittenText>
          </div>

          <ResponsiveGrid variant="polaroids" gap="large">
            {sampleMembers.map((member, index) => (
              <div key={member.id} className="flex justify-center">
                <PolaroidCard
                  member={member}
                  rotation={Math.random() * 6 - 3}
                  onClick={() => console.log(`Clicked on ${member.name}`)}
                />
              </div>
            ))}
          </ResponsiveGrid>
        </section>

        {/* Color System Showcase */}
        <section className="p-8 space-y-6 max-w-4xl mx-auto">
          <VintageLabel>Color System</VintageLabel>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Cork Colors */}
            <div className="space-y-2">
              <Typography variant="label-small">CORK COLORS</Typography>
              <div className="space-y-1">
                <div className="h-12 bg-cork-light rounded-sm shadow-sm" />
                <div className="h-12 bg-cork-brown rounded-sm shadow-sm" />
                <div className="h-12 bg-cork-dark rounded-sm shadow-sm" />
              </div>
            </div>

            {/* Polaroid Colors */}
            <div className="space-y-2">
              <Typography variant="label-small">POLAROID COLORS</Typography>
              <div className="space-y-1">
                <div className="h-12 bg-polaroid-white rounded-sm shadow-sm border" />
                <div className="h-12 bg-polaroid-cream rounded-sm shadow-sm" />
                <div className="h-12 bg-polaroid-border rounded-sm shadow-sm" />
              </div>
            </div>

            {/* Pin Colors */}
            <div className="space-y-2">
              <Typography variant="label-small">PIN COLORS</Typography>
              <div className="space-y-1">
                <div className="h-12 bg-pin-cherry-500 rounded-sm shadow-pin" />
                <div className="h-12 bg-pin-mustard-500 rounded-sm shadow-pin" />
                <div className="h-12 bg-pin-teal-500 rounded-sm shadow-pin" />
                <div className="h-12 bg-pin-lavender-500 rounded-sm shadow-pin" />
              </div>
            </div>

            {/* Text Colors */}
            <div className="space-y-2">
              <Typography variant="label-small">TEXT COLORS</Typography>
              <div className="space-y-1">
                <div className="h-12 bg-text-primary rounded-sm shadow-sm" />
                <div className="h-12 bg-text-secondary rounded-sm shadow-sm" />
                <div className="h-12 bg-text-muted rounded-sm shadow-sm" />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="p-8 text-center">
          <Typography variant="body-small" color="muted">
            Stage 4 Implementation Complete - All visual design components are functional and tested
          </Typography>
        </footer>
      </div>
    </CorkBoardBackground>
  );
}