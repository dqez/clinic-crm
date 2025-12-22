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
          age: number | null
          assigned_by: string | null
          booking_time: string
          clinic_id: string | null
          created_at: string | null
          doctor_id: string | null
          gender: string | null
          id: string
          patient_name: string
          patient_phone: string
          service_id: string | null
          staff_note: string | null
          status: string | null
          symptoms: string | null
          user_id: string | null
        }
        Insert: {
          age?: number | null
          assigned_by?: string | null
          booking_time: string
          clinic_id?: string | null
          created_at?: string | null
          doctor_id?: string | null
          gender?: string | null
          id?: string
          patient_name: string
          patient_phone: string
          service_id?: string | null
          staff_note?: string | null
          status?: string | null
          symptoms?: string | null
          user_id?: string | null
        }
        Update: {
          age?: number | null
          assigned_by?: string | null
          booking_time?: string
          clinic_id?: string | null
          created_at?: string | null
          doctor_id?: string | null
          gender?: string | null
          id?: string
          patient_name?: string
          patient_phone?: string
          service_id?: string | null
          staff_note?: string | null
          status?: string | null
          symptoms?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_bookings_assigned_by_users_id"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookings_clinic_id_clinics_id"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookings_doctor_id_doctors_id"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookings_service_id_services_id"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookings_user_id_users_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          email: string
          id: string
          image_url: string | null
          name: string
          phone: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          image_url?: string | null
          name: string
          phone: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          image_url?: string | null
          name?: string
          phone?: string
        }
        Relationships: []
      }
      doctor_schedules: {
        Row: {
          created_at: string | null
          date: string
          doctor_id: string
          end_time: string
          id: string
          is_available: boolean | null
          max_patients: number | null
          shift_name: string | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          date: string
          doctor_id: string
          end_time: string
          id?: string
          is_available?: boolean | null
          max_patients?: number | null
          shift_name?: string | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          date?: string
          doctor_id?: string
          end_time?: string
          id?: string
          is_available?: boolean | null
          max_patients?: number | null
          shift_name?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_doctor_schedules_doctor_id_doctors_id"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_services: {
        Row: {
          doctor_id: string
          service_id: string
        }
        Insert: {
          doctor_id: string
          service_id: string
        }
        Update: {
          doctor_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_services_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctor_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          bio: string | null
          clinic_id: string | null
          created_at: string | null
          degree: string | null
          id: string
          is_available: boolean | null
          price_per_slot: number | null
          specialty: string
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          clinic_id?: string | null
          created_at?: string | null
          degree?: string | null
          id?: string
          is_available?: boolean | null
          price_per_slot?: number | null
          specialty: string
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          clinic_id?: string | null
          created_at?: string | null
          degree?: string | null
          id?: string
          is_available?: boolean | null
          price_per_slot?: number | null
          specialty?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_doctors_clinic_id_clinics_id"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_doctors_user_id_users_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          booking_id: string | null
          created_at: string | null
          diagnosis: string
          doctor_notes: string | null
          id: string
          prescription: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          diagnosis: string
          doctor_notes?: string | null
          id?: string
          prescription?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          diagnosis?: string
          doctor_notes?: string | null
          id?: string
          prescription?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_medical_records_booking_id_bookings_id"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          cashier_id: string | null
          created_at: string | null
          id: string
          method: string | null
          payment_date: string | null
          status: string | null
          transaction_code: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          cashier_id?: string | null
          created_at?: string | null
          id?: string
          method?: string | null
          payment_date?: string | null
          status?: string | null
          transaction_code?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          cashier_id?: string | null
          created_at?: string | null
          id?: string
          method?: string | null
          payment_date?: string | null
          status?: string | null
          transaction_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_payments_booking_id_bookings_id"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_payments_cashier_id_users_id"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string
          password: string
          phone: string
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          password: string
          phone: string
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          password?: string
          phone?: string
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
