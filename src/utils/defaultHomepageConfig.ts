export interface HomepageConfig {
  seo: {
    title: string;
    description: string;
    keywords: string;
    og_image: string;
  };
  hero: {
    enabled: boolean;
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
    image_url: string;
    video_url: string;
  };
  collections_manager: {
    enabled: boolean;
    title: string;
    subtitle: string;
    cards: Array<{
      id: string;
      name: string;
      description: string;
      image: string;
      link: string;
    }>;
  };
  trending: {
    enabled: boolean;
    title: string;
    subtitle: string;
    product_ids: string[];
    hidden_product_ids: string[];
  };
  new_arrivals: {
    enabled: boolean;
    title: string;
    subtitle: string;
    product_ids: string[];
    display_style: 'grid' | 'carousel' | 'bento';
  };
  promotional_banners: Array<{
    id: string;
    enabled: boolean;
    title: string;
    description: string;
    image_url: string;
    cta_text: string;
    cta_link: string;
    start_date?: string;
    end_date?: string;
  }>;
  testimonials: {
    enabled: boolean;
    title: string;
    items: Array<{
      id: string;
      name: string;
      role: string;
      comment: string;
      rating: number;
      photo_url: string;
    }>;
  };
  newsletter: {
    enabled: boolean;
    title: string;
    description: string;
  };
  footer: {
    contact_phone: string;
    whatsapp_number: string;
    email: string;
    address: string;
    social_instagram: string;
    social_facebook: string;
    social_twitter: string;
    social_pinterest: string;
    copyright_text: string;
  };
  section_order: string[]; // List of section IDs to control their layout sequence
}

export const defaultHomepageConfig: HomepageConfig = {
  seo: {
    title: "Debbie Atelier | Premium Luxury Fashion Kampala",
    description: "Sartorial Ugandan heritage aligned with digital high-fashion architectures. Custom hand-finished lookbooks, virtual outfit creation & generative style recommendations.",
    keywords: "debbie atelier, kampala fashion, luxury cotton uganda, bespoke clothing, personal stylist ai",
    og_image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200"
  },
  hero: {
    enabled: true,
    title: "UNCOMPROMISING ELEGANCE",
    subtitle: "Hand-loomed cotton thistles, structured silk coordinates & bespoke atelier pieces from East Africa.",
    cta_text: "EXPLORE KAMPALA CAPSULES",
    cta_link: "catalog",
    image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600",
    video_url: ""
  },
  collections_manager: {
    enabled: true,
    title: "Thematic Collections",
    subtitle: "Uniquely engineered garment drop sequences matching lifestyle expressions.",
    cards: [
      {
        id: "col-1",
        name: "Campus Drip",
        description: "Vibrant high-contrast utility jackets and structured accessories for active academic environments.",
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600",
        link: "catalog?collection=col-1"
      },
      {
        id: "col-2",
        name: "CEO Mode",
        description: "Sharp structured lapels, double-breasted suits, and crisp wool to project business excellence.",
        image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600",
        link: "catalog?collection=col-2"
      },
      {
        id: "col-3",
        name: "Streetwear Escapes",
        description: "Oversized silhouette denim, rugged work pants, and accessories styled for urban exploration.",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600",
        link: "catalog?collection=col-3"
      },
      {
        id: "col-4",
        name: "Premium Luxury Capsules",
        description: "Pure mulberry silk loungewear, handlocked gold thistles and high-end occasion wears.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600",
        link: "catalog?collection=col-4"
      }
    ]
  },
  trending: {
    enabled: true,
    title: "Trending This Week",
    subtitle: "The absolute highpoints of our recent lookbook curation.",
    product_ids: [], // If empty, we can grab trending products dynamically
    hidden_product_ids: []
  },
  new_arrivals: {
    enabled: true,
    title: "Fresh Introductions",
    subtitle: "Sartorial releases, immediately ready for custom courier dispatch in Kampala.",
    product_ids: [], // If empty, populate dynamically
    display_style: 'grid'
  },
  promotional_banners: [
    {
      id: "promo-banner-1",
      enabled: true,
      title: "EXCLUSIVE MULTI-BUY DROP",
      description: "Buy any two vintage heavy cotton cardigans and get an automatic silk handkerchief coordinate added to your box.",
      image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200",
      cta_text: "ACQUIRE COMBO",
      cta_link: "catalog",
      start_date: "2026-06-01",
      end_date: "2026-06-30"
    }
  ],
  testimonials: {
    enabled: true,
    title: "Sartorial Voices of Kampala",
    items: [
      {
        id: "test-1",
        name: "Brenda Nsemere",
        role: "FASHION EDITOR, KAMPALA TIMES",
        comment: "Debbie’s Atelier satisfies my longing for curated, high-texture garments. The Satin Draped slip dress was the center of attention during Nakasero Art Gala.",
        rating: 5,
        photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"
      },
      {
        id: "test-2",
        name: "Denis Katana",
        role: "CREATIVE STRATEGIST, STUDIO-KLA",
        comment: "The custom Outfit Creator simplified my collection shopping. Standard cargos coupled with hand-grained Italian high-tops are staples in modern Kampala streetwear.",
        rating: 5,
        photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200"
      },
      {
        id: "test-3",
        name: "Grace Auma",
        role: "RESORT COLLECTION DEVOTEE",
        comment: "The Gemini style consul recommendation matched my exact palette colors and stayed under my UGX 350K budget perfectly. Debbie's premium service is absolute genius.",
        rating: 5,
        photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200"
      }
    ]
  },
  newsletter: {
    enabled: true,
    title: "The Weekly Atelier Dossier",
    description: "Gain premier access to lookbook drops, private capsule introductions, and stylist-curated editorials. No spam, only luxury."
  },
  footer: {
    contact_phone: "+256 701 445588",
    whatsapp_number: "+256 701 445588",
    email: "curator@debbieatelier.com",
    address: "Debbie Atelier Chambers, Plot 12 Acacia Avenue, Kololo, Kampala, Uganda",
    social_instagram: "https://instagram.com/debbieatelier",
    social_facebook: "https://facebook.com/debbieatelier",
    social_twitter: "https://twitter.com/debbieatelier",
    social_pinterest: "https://pinterest.com/debbieatelier",
    copyright_text: "DEBBIE FASHION LTD. Sourced dynamically with premium couture standards in Kampala."
  },
  section_order: ['hero', 'flash_sale', 'collections', 'trending', 'outfit_teaser', 'new_arrivals', 'promo_banners', 'testimonials', 'newsletter']
};
