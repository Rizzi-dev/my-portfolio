export type PortfolioSectionSlug =
  | "about"
  | "projects"
  | "experience"
  | "skills";

export interface PortfolioLink {
  label: string;
  href: string;
}

export interface PortfolioHighlight {
  label: string;
  value: string;
}

export interface PortfolioProfile {
  name: string;
  title: string;
  summary: string;
  photo?: string;
  highlights: PortfolioHighlight[];
  links: PortfolioLink[];
}

export interface PortfolioSection {
  slug: PortfolioSectionSlug;
  eyebrow: string;
  title: string;
  body: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image?: string;
}

export interface PortfolioContent {
  profile: PortfolioProfile;
  sections: PortfolioSection[];
}
