import type { Property } from './property';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
export type LeadSource = 'website' | 'phone' | 'email' | 'referral' | 'other';
export type InquiryStatus = 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
export type VisitStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export interface Lead {
  id: string;
  property_id: string;
  agent_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: LeadStatus;
  source: LeadSource;
  created_at: string;
  updated_at: string;
  property?: Property;
}

export interface Inquiry {
  id: string;
  property_id: string;
  agent_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: InquiryStatus;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  property?: Property;
}

export interface Visit {
  id: string;
  property_id: string;
  agent_id: string;
  lead_id: string | null;
  inquiry_id: string | null;
  visit_date: string;
  visit_time: string;
  status: VisitStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  property?: Property;
  lead?: Lead;
  inquiry?: Inquiry;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  properties?: Property[];
  leads?: Lead[];
  inquiries?: Inquiry[];
  visits?: Visit[];
} 