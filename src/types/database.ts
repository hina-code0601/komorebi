export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          character_id: string
          started_at: string
          last_visited_at: string | null
          plan: string
          created_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          character_id?: string
          started_at?: string
          last_visited_at?: string | null
          plan?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          character_id?: string
          started_at?: string
          last_visited_at?: string | null
          plan?: string
          created_at?: string
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          id: string
          user_id: string
          entry_date: string
          good_thing: string | null
          hard_thing: string | null
          tomorrow: string | null
          emotion_tag: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          entry_date: string
          good_thing?: string | null
          hard_thing?: string | null
          tomorrow?: string | null
          emotion_tag?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          entry_date?: string
          good_thing?: string | null
          hard_thing?: string | null
          tomorrow?: string | null
          emotion_tag?: string | null
          created_at?: string
        }
        Relationships: []
      }
      daily_summaries: {
        Row: {
          id: string
          user_id: string
          entry_date: string
          summary: string | null
          positive_score: number
          action_score: number
          wave_score: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          entry_date: string
          summary?: string | null
          positive_score?: number
          action_score?: number
          wave_score?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          entry_date?: string
          summary?: string | null
          positive_score?: number
          action_score?: number
          wave_score?: number
          created_at?: string
        }
        Relationships: []
      }
      user_profile_summary: {
        Row: {
          id: string
          user_id: string
          profile_text: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          profile_text?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          profile_text?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      character_evolution: {
        Row: {
          id: string
          user_id: string
          evolution_stage: number
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          evolution_stage?: number
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          evolution_stage?: number
          unlocked_at?: string
        }
        Relationships: []
      }
      streaks: {
        Row: {
          id: string
          user_id: string
          current_streak: number
          longest_streak: number
          last_entry_date: string | null
        }
        Insert: {
          id?: string
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_entry_date?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_entry_date?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
