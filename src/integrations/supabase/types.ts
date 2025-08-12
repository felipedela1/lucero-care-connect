// src/integrations/supabase/types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["user_role"] | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          city: string | null; // default "Sevilla"
          phone: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          role?: Database["public"]["Enums"]["user_role"] | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          phone?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["user_role"] | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          phone?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      services: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          base_rate_hour: number; // 10 / 12
          is_active: boolean;
          duration_min: number;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          base_rate_hour: number;
          is_active?: boolean;
          duration_min: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          base_rate_hour?: number;
          is_active?: boolean;
          duration_min?: number;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };

      availability_slots: {
        Row: {
          id: string;
          caregiver_id: string;
          start_at: string; // timestamptz ISO
          end_at: string;   // timestamptz ISO
          is_bookable: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          caregiver_id: string;
          start_at: string;
          end_at: string;
          is_bookable?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          caregiver_id?: string;
          start_at?: string;
          end_at?: string;
          is_bookable?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "availability_slots_caregiver_id_fkey";
            columns: ["caregiver_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      bookings: {
        Row: {
          id: string;
          family_id: string;
          caregiver_id: string;
          service_id: string;
          start_at: string;
          end_at: string;
          hours: number; // calculado
          is_near_metro: boolean;
          rate_applied: number; // 10 o 12
          price_estimated: number; // rate * hours
          status: Database["public"]["Enums"]["booking_status"];
          address: string | null;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          family_id: string;
          caregiver_id: string;
          service_id: string;
          start_at: string;
          end_at: string;
          hours?: number;
          is_near_metro: boolean;
          rate_applied?: number;
          price_estimated?: number;
          status?: Database["public"]["Enums"]["booking_status"];
          address?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          family_id?: string;
          caregiver_id?: string;
          service_id?: string;
          start_at?: string;
          end_at?: string;
          hours?: number;
          is_near_metro?: boolean;
          rate_applied?: number;
          price_estimated?: number;
          status?: Database["public"]["Enums"]["booking_status"];
          address?: string | null;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_family_id_fkey";
            columns: ["family_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_caregiver_id_fkey";
            columns: ["caregiver_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_service_id_fkey";
            columns: ["service_id"];
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };

      children: {
        Row: {
          id: string;
          family_id: string;
          name: string;
          age_years: number;
          allergies: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          family_id: string;
          name: string;
          age_years: number;
          allergies?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          family_id?: string;
          name?: string;
          age_years?: number;
          allergies?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "children_family_id_fkey";
            columns: ["family_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      reviews: {
        Row: {
          id: string;
          booking_id: string;
          rating: number; // 1-5
          comment: string;
          is_approved: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          booking_id: string;
          rating: number;
          comment: string;
          is_approved?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          booking_id?: string;
          rating?: number;
          comment?: string;
          is_approved?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey";
            columns: ["booking_id"];
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      [_ in string]: never;
    };

    Enums: {
      user_role: "cuidadora" | "familia";
      booking_status: "pending" | "confirmed" | "completed" | "cancelled";
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
};