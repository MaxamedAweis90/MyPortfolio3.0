export type SocialLinks = {
  linkedin?: string;
  youtube?: string;
  instagram?: string;
  behance?: string;
};

export type AppContext = {
  name?: string;
  siteUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  resume?: string;
  socialLinks?: SocialLinks;
};

export type CertificateCategory = {
  _id: string;
  title: string;
};

export type Certificate = {
  _id: string;
  title: string;
  issuer?: string;
  issuedDate?: string;
  category?: { _ref?: string; title?: string };
  imageUrl?: string;
  link?: string;
  verificationUrl?: string;
  verificationCode?: string;
};

export type Tool = {
  _id?: string;
  title?: string;
  icon?: string;
  color?: string;
};

export type Project = {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  category: "Web" | "Mobile" | "Design" | string;
  tools?: Tool[];
  description?: string;
  longDescription?: string[];
  images?: string[];
  liveProjectUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  clientUrl?: string;
  serverUrl?: string;
  shortTagline?: string;
  appIconUrl?: string;
  apkUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  screenshots?: string[];

  // Sorting & Flagging Schema Additions
  isBest?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  popularity?: number;
  isPopular?: boolean;
  projectNumber?: number;
  sortOrder?: number;
  order?: number;
};
