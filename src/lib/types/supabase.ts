export type PropertyType = 'HOUSE' | 'APARTMENT' | 'LAND' | 'COMMERCIAL' | 'OFFICE'
export type PropertyStatus = 'FOR_SALE' | 'FOR_RENT' | 'SOLD' | 'RENTED'
export type UserRole = 'ADMIN' | 'AGENT' | 'CLIENT'
export type UserStatus = 'ACTIVE' | 'INACTIVE'
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          title: string
          description: string
          type: PropertyType
          status: PropertyStatus
          price: number
          currency: string
          bedrooms: number | null
          bathrooms: number | null
          area_size: number
          area_unit: string
          address: string
          city: string
          state: string
          postal_code: string
          country: string
          latitude: number
          longitude: number
          features: string[]
          agent_id: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['properties']['Insert']>
      }
      property_media: {
        Row: {
          id: string
          property_id: string
          url: string
          type: 'IMAGE' | 'VIDEO'
          is_featured: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['property_media']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['property_media']['Insert']>
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: UserRole
          status: UserStatus
          phone: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      appointments: {
        Row: {
          id: string
          property_id: string
          client_id: string
          agent_id: string
          date: string
          status: AppointmentStatus
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>
      }
      leads: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          message: string
          property_id: string | null
          status: LeadStatus
          assigned_agent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
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
  }
} 