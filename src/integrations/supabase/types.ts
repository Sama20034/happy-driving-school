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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          branch_id: string
          captain_id: string
          course_id: string
          created_at: string
          customer_name: string
          customer_notes: string | null
          customer_phone: string
          governorate_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          branch_id: string
          captain_id: string
          course_id: string
          created_at?: string
          customer_name: string
          customer_notes?: string | null
          customer_phone: string
          governorate_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          branch_id?: string
          captain_id?: string
          course_id?: string
          created_at?: string
          customer_name?: string
          customer_notes?: string | null
          customer_phone?: string
          governorate_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "captains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_governorate_id_fkey"
            columns: ["governorate_id"]
            isOneToOne: false
            referencedRelation: "governorates"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string | null
          created_at: string
          display_order: number
          governorate_id: string
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          display_order?: number
          governorate_id: string
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          created_at?: string
          display_order?: number
          governorate_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_governorate_id_fkey"
            columns: ["governorate_id"]
            isOneToOne: false
            referencedRelation: "governorates"
            referencedColumns: ["id"]
          },
        ]
      }
      captain_availability: {
        Row: {
          captain_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          slot_duration_minutes: number
          start_time: string
        }
        Insert: {
          captain_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          slot_duration_minutes?: number
          start_time: string
        }
        Update: {
          captain_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          slot_duration_minutes?: number
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "captain_availability_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "captains"
            referencedColumns: ["id"]
          },
        ]
      }
      captain_bookings: {
        Row: {
          booking_date: string
          booking_time: string
          captain_confirmed_at: string | null
          captain_confirmed_payment: boolean | null
          captain_id: string
          created_at: string
          deposit_amount: number | null
          deposit_image_url: string | null
          duration_minutes: number
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string
          remaining_amount: number | null
          status: string
          total_price: number
          trainee_confirmed_at: string | null
          trainee_confirmed_payment: boolean | null
          trainee_id: string
          trainee_name: string
          trainee_phone: string | null
          updated_at: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          captain_confirmed_at?: string | null
          captain_confirmed_payment?: boolean | null
          captain_id: string
          created_at?: string
          deposit_amount?: number | null
          deposit_image_url?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          remaining_amount?: number | null
          status?: string
          total_price: number
          trainee_confirmed_at?: string | null
          trainee_confirmed_payment?: boolean | null
          trainee_id: string
          trainee_name: string
          trainee_phone?: string | null
          updated_at?: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          captain_confirmed_at?: string | null
          captain_confirmed_payment?: boolean | null
          captain_id?: string
          created_at?: string
          deposit_amount?: number | null
          deposit_image_url?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          remaining_amount?: number | null
          status?: string
          total_price?: number
          trainee_confirmed_at?: string | null
          trainee_confirmed_payment?: boolean | null
          trainee_id?: string
          trainee_name?: string
          trainee_phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "captain_bookings_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "captain_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      captain_cars: {
        Row: {
          captain_id: string
          car_photo_url: string | null
          car_type: string
          created_at: string
          id: string
          is_primary: boolean
          transmission_type: string
        }
        Insert: {
          captain_id: string
          car_photo_url?: string | null
          car_type: string
          created_at?: string
          id?: string
          is_primary?: boolean
          transmission_type: string
        }
        Update: {
          captain_id?: string
          car_photo_url?: string | null
          car_type?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          transmission_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "captain_cars_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "captain_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      captain_course_prices: {
        Row: {
          captain_id: string
          course_type: string
          created_at: string
          id: string
          session_price: number
          updated_at: string
        }
        Insert: {
          captain_id: string
          course_type: string
          created_at?: string
          id?: string
          session_price?: number
          updated_at?: string
        }
        Update: {
          captain_id?: string
          course_type?: string
          created_at?: string
          id?: string
          session_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "captain_course_prices_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "captain_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      captain_profiles: {
        Row: {
          bio: string | null
          car_photo_url: string | null
          car_type: string | null
          created_at: string
          full_name: string
          governorate_id: string | null
          hourly_rate: number
          id: string
          is_available: boolean
          personal_photo_url: string | null
          phone: string | null
          rating: number | null
          status: string
          total_sessions: number | null
          transmission_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          car_photo_url?: string | null
          car_type?: string | null
          created_at?: string
          full_name: string
          governorate_id?: string | null
          hourly_rate?: number
          id?: string
          is_available?: boolean
          personal_photo_url?: string | null
          phone?: string | null
          rating?: number | null
          status?: string
          total_sessions?: number | null
          transmission_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          car_photo_url?: string | null
          car_type?: string | null
          created_at?: string
          full_name?: string
          governorate_id?: string | null
          hourly_rate?: number
          id?: string
          is_available?: boolean
          personal_photo_url?: string | null
          phone?: string | null
          rating?: number | null
          status?: string
          total_sessions?: number | null
          transmission_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "captain_profiles_governorate_id_fkey"
            columns: ["governorate_id"]
            isOneToOne: false
            referencedRelation: "governorates"
            referencedColumns: ["id"]
          },
        ]
      }
      captain_schedule: {
        Row: {
          captain_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          start_time: string
        }
        Insert: {
          captain_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          start_time: string
        }
        Update: {
          captain_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "captain_schedule_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "captain_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      captain_wallets: {
        Row: {
          balance: number
          captain_id: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          balance?: number
          captain_id: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          balance?: number
          captain_id?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "captain_wallets_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: true
            referencedRelation: "captain_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      captains: {
        Row: {
          branch_id: string
          created_at: string
          id: string
          image_url: string | null
          name: string
          rating: number | null
        }
        Insert: {
          branch_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          rating?: number | null
        }
        Update: {
          branch_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "captains_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          booking_id: string
          captain_id: string
          created_at: string
          id: string
          is_active: boolean
          trainee_id: string
        }
        Insert: {
          booking_id: string
          captain_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          trainee_id: string
        }
        Update: {
          booking_id?: string
          captain_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          trainee_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "captain_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "captain_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          image_url: string | null
          is_read: boolean
          message_type: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_read?: boolean
          message_type?: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_read?: boolean
          message_type?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          code: string | null
          created_at: string
          display_order: number
          id: string
          name: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          display_order?: number
          id?: string
          name: string
        }
        Update: {
          code?: string | null
          created_at?: string
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      course_prices: {
        Row: {
          branch_id: string | null
          course_id: string
          created_at: string
          governorate_id: string | null
          id: string
          price: number
        }
        Insert: {
          branch_id?: string | null
          course_id: string
          created_at?: string
          governorate_id?: string | null
          id?: string
          price: number
        }
        Update: {
          branch_id?: string | null
          course_id?: string
          created_at?: string
          governorate_id?: string | null
          id?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_prices_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_prices_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_prices_governorate_id_fkey"
            columns: ["governorate_id"]
            isOneToOne: false
            referencedRelation: "governorates"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          price: number
          sessions: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          price: number
          sessions?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          price?: number
          sessions?: number
          title?: string
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          is_pwa_code: boolean
          max_uses: number | null
          updated_at: string
          used_count: number
        }
        Insert: {
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_pwa_code?: boolean
          max_uses?: number | null
          updated_at?: string
          used_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_pwa_code?: boolean
          max_uses?: number | null
          updated_at?: string
          used_count?: number
        }
        Relationships: []
      }
      governorates: {
        Row: {
          country_id: string | null
          created_at: string
          display_order: number
          id: string
          name: string
        }
        Insert: {
          country_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          name: string
        }
        Update: {
          country_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "governorates_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_address: string
          customer_name: string
          customer_notes: string | null
          customer_phone: string
          id: string
          payment_method: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_address: string
          customer_name: string
          customer_notes?: string | null
          customer_phone: string
          id?: string
          payment_method?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_address?: string
          customer_name?: string
          customer_notes?: string | null
          customer_phone?: string
          id?: string
          payment_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          price: number
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          price: number
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          price?: number
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approval_status: string | null
          car_license_url: string | null
          car_photo_url: string | null
          car_type: string | null
          created_at: string
          driving_license_url: string | null
          full_name: string | null
          id: string
          id_card_url: string | null
          is_approved: boolean | null
          meeting_point: string | null
          personal_photo_url: string | null
          phone: string | null
          rejection_reason: string | null
          training_governorate_id: string | null
          transmission_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          approval_status?: string | null
          car_license_url?: string | null
          car_photo_url?: string | null
          car_type?: string | null
          created_at?: string
          driving_license_url?: string | null
          full_name?: string | null
          id: string
          id_card_url?: string | null
          is_approved?: boolean | null
          meeting_point?: string | null
          personal_photo_url?: string | null
          phone?: string | null
          rejection_reason?: string | null
          training_governorate_id?: string | null
          transmission_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approval_status?: string | null
          car_license_url?: string | null
          car_photo_url?: string | null
          car_type?: string | null
          created_at?: string
          driving_license_url?: string | null
          full_name?: string | null
          id?: string
          id_card_url?: string | null
          is_approved?: boolean | null
          meeting_point?: string | null
          personal_photo_url?: string | null
          phone?: string | null
          rejection_reason?: string | null
          training_governorate_id?: string | null
          transmission_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_training_governorate_id_fkey"
            columns: ["training_governorate_id"]
            isOneToOne: false
            referencedRelation: "governorates"
            referencedColumns: ["id"]
          },
        ]
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
          role?: Database["public"]["Enums"]["app_role"]
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
      wallet_transactions: {
        Row: {
          amount: number
          captain_id: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          transaction_type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          captain_id: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          transaction_type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          captain_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          transaction_type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "captain_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "captain_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "captain" | "trainee"
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
      app_role: ["admin", "user", "captain", "trainee"],
    },
  },
} as const
