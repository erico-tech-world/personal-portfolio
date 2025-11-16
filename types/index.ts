export interface NavLink {
  name: string;
  href: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  included_items: string[];
  price_min: number;
  price_max: number;
  currency: 'NGN' | 'USD';
}

export interface GalleryItem {
  id: number;
  imageUrl: string;
  category: string;
  publicId: string; // From Cloudinary
  title?: string;
  description?: string;
  project_url?: string;
}

export interface ContactMessage {
  id: number;
  created_at: string;
  name: string;
  email: string;
  message: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
}
