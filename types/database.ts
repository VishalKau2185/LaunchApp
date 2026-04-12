export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Platform =
  | "reddit"
  | "twitter"
  | "indie_hackers"
  | "hacker_news"
  | "medium"
  | "devto"
  | "hashnode"
  | "product_hunt"
  | "betalist"
  | "uneed"
  | "launching_next"
  | "sideprojectors"
  | "microlaunch"
  | "peerlist"

export type OpportunityStatus = "pending" | "done"
export type DiscoveryStatus = "pending" | "in_progress" | "complete" | "error"

export interface Database {
  public: {
    Tables: {
      users: {
        Row: { id: string; email: string; plan: string; created_at: string }
        Insert: { id?: string; email: string; plan?: string; created_at?: string }
        Update: { id?: string; email?: string; plan?: string; created_at?: string }
        Relationships: []
      }
      startups: {
        Row: {
          id: string; user_id: string; name: string; description: string
          website: string | null; category: string | null; target_audience: string | null
          keywords: string[]; discovery_status: DiscoveryStatus
          created_at: string; updated_at: string
        }
        Insert: {
          id?: string; user_id: string; name: string; description: string
          website?: string | null; category?: string | null; target_audience?: string | null
          keywords?: string[]; discovery_status?: DiscoveryStatus
          created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; user_id?: string; name?: string; description?: string
          website?: string | null; category?: string | null; target_audience?: string | null
          keywords?: string[]; discovery_status?: DiscoveryStatus
          created_at?: string; updated_at?: string
        }
        Relationships: []
      }
      communities: {
        Row: {
          id: string; platform: Platform; name: string; url: string
          tags: string[]; members: number; active: boolean
          self_promo_allowed: boolean | null; links_allowed: boolean | null
          rules_summary: string | null; last_checked: string | null
          vertical: string | null; audience_type: string | null
          quality_score: number; activity_score: number
          content_type: string | null; platform_type: string | null
          created_at: string
        }
        Insert: {
          id?: string; platform: Platform; name: string; url: string
          tags?: string[]; members?: number; active?: boolean
          self_promo_allowed?: boolean | null; links_allowed?: boolean | null
          rules_summary?: string | null; last_checked?: string | null
          vertical?: string | null; audience_type?: string | null
          quality_score?: number; activity_score?: number
          content_type?: string | null; platform_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string; platform?: Platform; name?: string; url?: string
          tags?: string[]; members?: number; active?: boolean
          self_promo_allowed?: boolean | null; links_allowed?: boolean | null
          rules_summary?: string | null; last_checked?: string | null
          vertical?: string | null; audience_type?: string | null
          quality_score?: number; activity_score?: number
          content_type?: string | null; platform_type?: string | null
          created_at?: string
        }
        Relationships: []
      }
      user_communities: {
        Row: {
          id: string; user_id: string; community_id: string
          last_used_at: string | null; usage_count: number
          last_status: string | null; created_at: string
        }
        Insert: {
          id?: string; user_id: string; community_id: string
          last_used_at?: string | null; usage_count?: number
          last_status?: string | null; created_at?: string
        }
        Update: {
          id?: string; user_id?: string; community_id?: string
          last_used_at?: string | null; usage_count?: number
          last_status?: string | null; created_at?: string
        }
        Relationships: []
      }
      daily_opportunities: {
        Row: {
          id: string; user_id: string; date: string; platform: Platform
          community_id: string | null; post_url: string
          generated_title: string | null; generated_body: string
          template_type: string; status: OpportunityStatus
          slot_index: number; regen_count: number
          match_reason: string | null; created_at: string
        }
        Insert: {
          id?: string; user_id: string; date: string; platform: Platform
          community_id?: string | null; post_url: string
          generated_title?: string | null; generated_body: string
          template_type: string; status?: OpportunityStatus
          slot_index: number; regen_count?: number
          match_reason?: string | null; created_at?: string
        }
        Update: {
          id?: string; user_id?: string; date?: string; platform?: Platform
          community_id?: string | null; post_url?: string
          generated_title?: string | null; generated_body?: string
          template_type?: string; status?: OpportunityStatus
          slot_index?: number; regen_count?: number
          match_reason?: string | null; created_at?: string
        }
        Relationships: []
      }
      daily_posts: {
        Row: { id: string; user_id: string; [key: string]: unknown }
        Insert: { id?: string; user_id: string; [key: string]: unknown }
        Update: { id?: string; [key: string]: unknown }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      increment_community_usage: {
        Args: { p_user_id: string; p_community_id: string }
        Returns: undefined
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
    PostgrestVersion: "12"
  }
}

export interface OpportunityWithCommunity {
  id: string; user_id: string; date: string; platform: Platform
  community_id: string | null; community_name: string | null
  post_url: string; generated_title: string | null; generated_body: string
  template_type: string; status: OpportunityStatus
  slot_index: number; regen_count: number; match_reason: string | null
}
