export type Category = 
  | 'all' 
  | 'ui-kits' 
  | 'digital-art' 
  | 'fonts' 
  | 'mockups' 
  | 'templates' 
  | 'software';

export type LicenseType = 'personal' | 'commercial' | 'extended';

export interface LicenseOption {
  type: LicenseType;
  name: string;
  price: number;
  description: string;
  rights: string[];
}

export interface Author {
  name: string;
  avatar: string;
  studio: string;
  verified: boolean;
}

export interface SampleContent {
  fontData?: {
    familyName: string;
    sampleText: string;
    weights: string[];
    features: string[];
  };
  codeSnippet?: {
    language: string;
    title: string;
    code: string;
  };
  uiKitComponents?: {
    name: string;
    previewType: 'button' | 'card' | 'badge' | 'input' | 'hero';
    description: string;
  }[];
  artPrintDetails?: {
    dimensions: string;
    colorSpace: string;
    dpi: number;
    artistNote: string;
  };
  softwareStack?: string[];
}

export interface Product {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: Category;
  categoryLabel: string;
  author: Author;
  rating: number;
  reviewsCount: number;
  downloadsCount: number;
  fileFormats: string[];
  fileSize: string;
  updatedAt: string;
  version: string;
  featured?: boolean;
  trending?: boolean;
  price: number;
  licenses: LicenseOption[];
  previewImage: string;
  galleryImages: string[];
  specifications: Record<string, string>;
  sampleContent?: SampleContent;
  downloadUrl?: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  selectedLicense: LicenseOption;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  category: string;
  licenseName: string;
  price: number;
  downloadKey: string;
  previewImage: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'completed' | 'processing';
  licenseCertificateId: string;
  paymentMethod: string;
}

export interface AIRecommendationRequest {
  projectScope: string;
  styleVibe: string;
  budgetRange?: string;
}

export interface AIRecommendationResponse {
  summary: string;
  recommendedProductIds: string[];
  designTips: string[];
  curatedColorPalette?: string[];
  suggestedTypographyPairing?: string;
}
