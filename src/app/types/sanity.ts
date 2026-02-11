export type SocialLinks = {
  linkedin?: string;
  youtube?: string;
  instagram?: string;
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

export type SanityImageAsset = {
  url?: string;
};

export type SanityImageRef = {
  image?: {
    asset?: SanityImageAsset;
  };
};

export type Certificate = {
  _id: string;
  title: string;
  issuer?: string;
  issuedDate?: string;
  category?: { _ref?: string };
  imageRef?: SanityImageRef;
  link?: string;
  verificationUrl?: string;
  verificationCode?: string;
  _createdAt?: string;
};

export type Tool = {
  _id?: string;
  title?: string;
  icon?: string;
  color?: string;
};

export type Project = {
  _id: string;
  title: string;
  slug?: string;
  category?: string;
  tools?: Tool[];
  description?: string;
  images?: string[];
  liveProjectUrl?: string;
  shortTagline?: string;
  appIconUrl?: string;
  apkUrl?: string;
  screenshots?: string[];
};
