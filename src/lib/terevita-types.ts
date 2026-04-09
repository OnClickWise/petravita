export type TerevitaLandingConfig = {
  slug: string;
  name: string;
  organization_id: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  email: string | null;
  phone: string | null;
};

export type TerevitaLeadPayload = {
  name: string;
  email: string;
  phone?: string;
  ssn?: string;
  ein?: string;
  source?: string;
  location?: string;
  status?: string;
  interest?: string;
  description?: string;
  show_on_pipeline?: boolean;
  origin_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  consent?: boolean;
};
