export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PropertyType = 'HOUSE' | 'APARTMENT' | 'LAND' | 'COMMERCIAL' | 'OFFICE'
export type PropertyStatus = 'FOR_SALE' | 'FOR_RENT' | 'SOLD' | 'RENTED'
export type UserRole = 'ADMIN' | 'AGENT' | 'CLIENT'
export type UserStatus = 'ACTIVE' | 'INACTIVE'
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST' | 'CONVERTED'
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string
          role: UserRole
          status: UserStatus
          phone: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          full_name: string
          role?: UserRole
          status?: UserStatus
          phone?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          role?: UserRole
          status?: UserStatus
          phone?: string | null
          avatar_url?: string | null
        }
      }
      properties: {
        Row: {
          id: string
          created_at: string
          updated_at: string
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
          features: string[] | null
          agent_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          type: PropertyType
          status: PropertyStatus
          price: number
          currency?: string
          bedrooms?: number | null
          bathrooms?: number | null
          area_size: number
          area_unit: string
          address: string
          city: string
          state: string
          postal_code: string
          features?: string[] | null
          agent_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          type?: PropertyType
          status?: PropertyStatus
          price?: number
          currency?: string
          bedrooms?: number | null
          bathrooms?: number | null
          area_size?: number
          area_unit?: string
          address?: string
          city?: string
          state?: string
          postal_code?: string
          features?: string[] | null
          agent_id?: string
        }
      }
      property_media: {
        Row: {
          id: string
          created_at: string
          property_id: string
          url: string
          type: string
          order: number
        }
        Insert: {
          id?: string
          created_at?: string
          property_id: string
          url: string
          type: string
          order?: number
        }
        Update: {
          id?: string
          created_at?: string
          property_id?: string
          url?: string
          type?: string
          order?: number
        }
      }
      leads: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string
          email: string
          phone: string
          message: string
          property_id: string
          assigned_agent_id: string | null
          status: LeadStatus
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name: string
          email: string
          phone: string
          message: string
          property_id: string
          assigned_agent_id?: string | null
          status?: LeadStatus
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          email?: string
          phone?: string
          message?: string
          property_id?: string
          assigned_agent_id?: string | null
          status?: LeadStatus
          notes?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          property_id: string
          client_id: string
          agent_id: string
          date: string
          time: string
          status: AppointmentStatus
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          property_id: string
          client_id: string
          agent_id: string
          date: string
          time: string
          status?: AppointmentStatus
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          property_id?: string
          client_id?: string
          agent_id?: string
          date?: string
          time?: string
          status?: AppointmentStatus
          notes?: string | null
        }
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