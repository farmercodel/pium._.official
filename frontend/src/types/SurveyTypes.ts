export const TONES = ["Casual","professional","Witty","emotional","urgent","luxury"] as const;
export type Tone = typeof TONES[number];

export interface BusinessHours { open: string; close: string; }

export interface GenerateAdRequest {
  store_name: string;
  area_keywords: string[];
  address: string;
  price: string;
  business_hours: BusinessHours;
  category: string;
  store_intro: string;
  tone?: Tone;
  reference_links?: string[];
  product_service_keywords?: string[];
  target_customers?: string[];
  instagram_id?: string;
  promotions?: string[];
  image_urls?: string[];
  hashtag_limit?: number;
  num_variants?: number;
  avoid_texts?: string[];
}
