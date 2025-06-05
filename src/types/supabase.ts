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
      agents: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          agent_id: string
          title: string
          description: string | null
          type: 'house' | 'apartment' | 'commercial'
          status: 'for_sale' | 'for_rent'
          price: number
          location: string
          bedrooms: number
          bathrooms: number
          area: number
          latitude: number
          longitude: number
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          title: string
          description?: string | null
          type: 'house' | 'apartment' | 'commercial'
          status: 'for_sale' | 'for_rent'
          price: number
          location: string
          bedrooms: number
          bathrooms: number
          area: number
          latitude: number
          longitude: number
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          title?: string
          description?: string | null
          type?: 'house' | 'apartment' | 'commercial'
          status?: 'for_sale' | 'for_rent'
          price?: number
          location?: string
          bedrooms?: number
          bathrooms?: number
          area?: number
          latitude?: number
          longitude?: number
          images?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          property_id: string
          agent_id: string
          name: string
          email: string
          phone: string | null
          status: 'new' | 'contacted' | 'qualified' | 'lost'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          agent_id: string
          name: string
          email: string
          phone?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'lost'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          agent_id?: string
          name?: string
          email?: string
          phone?: string | null
          status?: 'new' | 'contacted' | 'qualified' | 'lost'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          property_id: string
          agent_id: string
          name: string
          email: string
          phone: string | null
          message: string
          status: 'new' | 'read' | 'replied' | 'closed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          agent_id: string
          name: string
          email: string
          phone?: string | null
          message: string
          status?: 'new' | 'read' | 'replied' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          agent_id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          status?: 'new' | 'read' | 'replied' | 'closed'
          created_at?: string
          updated_at?: string
        }
      }
      visits: {
        Row: {
          id: string
          property_id: string
          agent_id: string
          name: string
          email: string
          phone: string | null
          preferred_date: string
          preferred_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          agent_id: string
          name: string
          email: string
          phone?: string | null
          preferred_date: string
          preferred_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          agent_id?: string
          name?: string
          email?: string
          phone?: string | null
          preferred_date?: string
          preferred_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          created_at?: string
          updated_at?: string
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