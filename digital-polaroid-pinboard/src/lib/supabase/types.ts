export interface Member {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role?: string;
  company?: string;
  bio?: string;
  photo_url?: string;
  pin_color: 'cherry' | 'mustard' | 'teal' | 'lavender';
  public_visibility: boolean;
  created_at: string;
  updated_at: string;
}

export type PinColor = 'cherry' | 'mustard' | 'teal' | 'lavender';

export interface Database {
  public: {
    Tables: {
      members: {
        Row: Member;
        Insert: Omit<Member, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Member, 'id' | 'created_at'>>;
      };
    };
  };
}

export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };