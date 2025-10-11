export interface ContentItem {
  id: string;
  page_slug: string;
  element_id: string;
  content_data: { text?: string; url?: string; alt?: string; link?: string; variant?: string; presets?: Array<{ amount: number; description: string }> };
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  order: number;
  is_external: boolean;
  parent_id: string | null;
}

export interface CauseData {
  id: string;
  title: string;
  hero_image_url: string;
  problem_statement: string;
  solution_description: string;
  impact_description: string;
  unit_costs: Array<{ amount: string; description: string }>;
  gallery_images: Array<{ src: string; alt: string }>;
  video_url: string;
  donate_button: { text: string; link: string };
  ketto_button: { text: string; link: string };
  giveindia_button: { text: string; link: string };
  volunteer_button: { text: string; link: string };
  order: number;
}