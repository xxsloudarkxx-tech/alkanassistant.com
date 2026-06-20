export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          category: string
          content: string
          cover_emoji: string
          created_at: string
          excerpt: string
          id: string
          published: boolean
          read_minutes: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content: string
          cover_emoji?: string
          created_at?: string
          excerpt: string
          id?: string
          published?: boolean
          read_minutes?: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          cover_emoji?: string
          created_at?: string
          excerpt?: string
          id?: string
          published?: boolean
          read_minutes?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bot_conversations: {
        Row: {
          conversation: Json | null
          created_at: string
          id: string
          interest: string | null
          message: string | null
          name: string | null
          payment_method: string | null
          phone: string | null
        }
        Insert: {
          conversation?: Json | null
          created_at?: string
          id?: string
          interest?: string | null
          message?: string | null
          name?: string | null
          payment_method?: string | null
          phone?: string | null
        }
        Update: {
          conversation?: Json | null
          created_at?: string
          id?: string
          interest?: string | null
          message?: string | null
          name?: string | null
          payment_method?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      client_profiles: {
        Row: {
          client_id: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          city: string | null
          client_id: string | null
          company: string | null
          created_at: string
          email: string | null
          enrichment_data: Json | null
          golden_lead: boolean
          id: string
          industry: string | null
          jurisdiction: string | null
          last_contacted: string | null
          name: string
          notes: string | null
          permit_data: Json | null
          permit_number: string | null
          permit_score: number | null
          phone: string | null
          source: string | null
          state: string | null
          status: string
          updated_at: string
        }
        Insert: {
          city?: string | null
          client_id?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          enrichment_data?: Json | null
          golden_lead?: boolean
          id?: string
          industry?: string | null
          jurisdiction?: string | null
          last_contacted?: string | null
          name: string
          notes?: string | null
          permit_data?: Json | null
          permit_number?: string | null
          permit_score?: number | null
          phone?: string | null
          source?: string | null
          state?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          city?: string | null
          client_id?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          enrichment_data?: Json | null
          golden_lead?: boolean
          id?: string
          industry?: string | null
          jurisdiction?: string | null
          last_contacted?: string | null
          name?: string
          notes?: string | null
          permit_data?: Json | null
          permit_number?: string | null
          permit_score?: number | null
          phone?: string | null
          source?: string | null
          state?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      voice_bookings: {
        Row: {
          city: string | null
          created_at: string
          email: string | null
          gcal_event_id: string | null
          gcal_event_link: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          scheduled_at: string | null
          service: string | null
          transcript: Json | null
          urgency: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          email?: string | null
          gcal_event_id?: string | null
          gcal_event_link?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          scheduled_at?: string | null
          service?: string | null
          transcript?: Json | null
          urgency?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string | null
          gcal_event_id?: string | null
          gcal_event_link?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          scheduled_at?: string | null
          service?: string | null
          transcript?: Json | null
          urgency?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_client_id: { Args: never; Returns: string }
      get_public_leads: {
        Args: never
        Returns: {
          city: string
          company_masked: string
          created_at: string
          first_name: string
          id: string
          industry: string
          state: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
