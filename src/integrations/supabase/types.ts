export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          media_item_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          media_item_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          media_item_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_media_item_id_fkey"
            columns: ["media_item_id"]
            isOneToOne: false
            referencedRelation: "media_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_media_item_id_fkey"
            columns: ["media_item_id"]
            isOneToOne: false
            referencedRelation: "media_items_with_creator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      media_items: {
        Row: {
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          media_type: string
          media_url: string
          project_id: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          media_type: string
          media_url: string
          project_id: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          media_type?: string
          media_url?: string
          project_id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_items_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tags: {
        Row: {
          created_at: string | null
          project_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          project_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          project_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tags_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tags_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          is_private: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      storage: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          course: string | null
          created_at: string | null
          email: string
          first_name: string | null
          github: string | null
          id: string
          instagram: string | null
          is_avatar_public: boolean | null
          is_bio_public: boolean | null
          is_email_public: boolean | null
          is_github_public: boolean | null
          is_instagram_public: boolean | null
          is_last_name_public: boolean | null
          is_linkedin_public: boolean | null
          is_twitter_public: boolean | null
          is_website_public: boolean | null
          last_name: string | null
          linkedin: string | null
          name: string
          notes: string | null
          role: string
          semester: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          twitter: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          course?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          github?: string | null
          id?: string
          instagram?: string | null
          is_avatar_public?: boolean | null
          is_bio_public?: boolean | null
          is_email_public?: boolean | null
          is_github_public?: boolean | null
          is_instagram_public?: boolean | null
          is_last_name_public?: boolean | null
          is_linkedin_public?: boolean | null
          is_twitter_public?: boolean | null
          is_website_public?: boolean | null
          last_name?: string | null
          linkedin?: string | null
          name: string
          notes?: string | null
          role: string
          semester?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          twitter?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          course?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          github?: string | null
          id?: string
          instagram?: string | null
          is_avatar_public?: boolean | null
          is_bio_public?: boolean | null
          is_email_public?: boolean | null
          is_github_public?: boolean | null
          is_instagram_public?: boolean | null
          is_last_name_public?: boolean | null
          is_linkedin_public?: boolean | null
          is_twitter_public?: boolean | null
          is_website_public?: boolean | null
          last_name?: string | null
          linkedin?: string | null
          name?: string
          notes?: string | null
          role?: string
          semester?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          twitter?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      media_items_with_creator: {
        Row: {
          created_at: string | null
          creator_avatar: string | null
          creator_id: string | null
          creator_name: string | null
          description: string | null
          id: string | null
          media_type: string | null
          media_url: string | null
          project_id: string | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_items_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_details: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          creator_id: string | null
          creator_name: string | null
          description: string | null
          id: string | null
          is_private: boolean | null
          tag_ids: string[] | null
          tag_names: string[] | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string | null
          bio: string | null
          course: string | null
          created_at: string | null
          email: string
          first_name: string | null
          github: string | null
          id: string
          instagram: string | null
          is_avatar_public: boolean | null
          is_bio_public: boolean | null
          is_email_public: boolean | null
          is_github_public: boolean | null
          is_instagram_public: boolean | null
          is_last_name_public: boolean | null
          is_linkedin_public: boolean | null
          is_twitter_public: boolean | null
          is_website_public: boolean | null
          last_name: string | null
          linkedin: string | null
          name: string
          notes: string | null
          role: string
          semester: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          twitter: string | null
          updated_at: string | null
          website: string | null
        }[]
      }
      get_user_by_id: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
      insert_user: {
        Args: {
          p_email: string
          p_name: string
          p_role: string
          p_first_name?: string
          p_last_name?: string
          p_course?: string
          p_semester?: string
          p_notes?: string
          p_status?: string
        }
        Returns: {
          avatar_url: string | null
          bio: string | null
          course: string | null
          created_at: string | null
          email: string
          first_name: string | null
          github: string | null
          id: string
          instagram: string | null
          is_avatar_public: boolean | null
          is_bio_public: boolean | null
          is_email_public: boolean | null
          is_github_public: boolean | null
          is_instagram_public: boolean | null
          is_last_name_public: boolean | null
          is_linkedin_public: boolean | null
          is_twitter_public: boolean | null
          is_website_public: boolean | null
          last_name: string | null
          linkedin: string | null
          name: string
          notes: string | null
          role: string
          semester: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          twitter: string | null
          updated_at: string | null
          website: string | null
        }[]
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_admin_secure: {
        Args: {
          check_user_id: string
        }
        Returns: boolean
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_user_bio:
        | {
            Args: {
              p_user_id: string
              p_bio: string
              p_email: string
              p_website: string
              p_linkedin: string
              p_twitter: string
              p_github: string
              p_instagram: string
            }
            Returns: {
              avatar_url: string | null
              bio: string | null
              course: string | null
              created_at: string | null
              email: string
              first_name: string | null
              github: string | null
              id: string
              instagram: string | null
              is_avatar_public: boolean | null
              is_bio_public: boolean | null
              is_email_public: boolean | null
              is_github_public: boolean | null
              is_instagram_public: boolean | null
              is_last_name_public: boolean | null
              is_linkedin_public: boolean | null
              is_twitter_public: boolean | null
              is_website_public: boolean | null
              last_name: string | null
              linkedin: string | null
              name: string
              notes: string | null
              role: string
              semester: string | null
              status: Database["public"]["Enums"]["user_status"] | null
              twitter: string | null
              updated_at: string | null
              website: string | null
            }[]
          }
        | {
            Args: {
              p_user_id: string
              p_bio: string
              p_website: string
              p_linkedin: string
              p_twitter: string
              p_github: string
              p_instagram: string
            }
            Returns: {
              avatar_url: string | null
              bio: string | null
              course: string | null
              created_at: string | null
              email: string
              first_name: string | null
              github: string | null
              id: string
              instagram: string | null
              is_avatar_public: boolean | null
              is_bio_public: boolean | null
              is_email_public: boolean | null
              is_github_public: boolean | null
              is_instagram_public: boolean | null
              is_last_name_public: boolean | null
              is_linkedin_public: boolean | null
              is_twitter_public: boolean | null
              is_website_public: boolean | null
              last_name: string | null
              linkedin: string | null
              name: string
              notes: string | null
              role: string
              semester: string | null
              status: Database["public"]["Enums"]["user_status"] | null
              twitter: string | null
              updated_at: string | null
              website: string | null
            }[]
          }
        | {
            Args: {
              p_user_id: string
              p_first_name?: string
              p_last_name?: string
              p_course?: string
              p_semester?: string
              p_bio?: string
              p_email?: string
              p_website?: string
              p_linkedin?: string
              p_twitter?: string
              p_github?: string
              p_instagram?: string
              p_is_last_name_public?: boolean
              p_is_avatar_public?: boolean
              p_is_bio_public?: boolean
              p_is_email_public?: boolean
              p_is_website_public?: boolean
              p_is_linkedin_public?: boolean
              p_is_twitter_public?: boolean
              p_is_github_public?: boolean
              p_is_instagram_public?: boolean
            }
            Returns: {
              avatar_url: string | null
              bio: string | null
              course: string | null
              created_at: string | null
              email: string
              first_name: string | null
              github: string | null
              id: string
              instagram: string | null
              is_avatar_public: boolean | null
              is_bio_public: boolean | null
              is_email_public: boolean | null
              is_github_public: boolean | null
              is_instagram_public: boolean | null
              is_last_name_public: boolean | null
              is_linkedin_public: boolean | null
              is_twitter_public: boolean | null
              is_website_public: boolean | null
              last_name: string | null
              linkedin: string | null
              name: string
              notes: string | null
              role: string
              semester: string | null
              status: Database["public"]["Enums"]["user_status"] | null
              twitter: string | null
              updated_at: string | null
              website: string | null
            }[]
          }
      update_user_status: {
        Args: {
          p_user_id: string
          p_status: string
        }
        Returns: {
          avatar_url: string | null
          bio: string | null
          course: string | null
          created_at: string | null
          email: string
          first_name: string | null
          github: string | null
          id: string
          instagram: string | null
          is_avatar_public: boolean | null
          is_bio_public: boolean | null
          is_email_public: boolean | null
          is_github_public: boolean | null
          is_instagram_public: boolean | null
          is_last_name_public: boolean | null
          is_linkedin_public: boolean | null
          is_twitter_public: boolean | null
          is_website_public: boolean | null
          last_name: string | null
          linkedin: string | null
          name: string
          notes: string | null
          role: string
          semester: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          twitter: string | null
          updated_at: string | null
          website: string | null
        }[]
      }
    }
    Enums: {
      user_status: "pending_review" | "approved" | "denied"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
