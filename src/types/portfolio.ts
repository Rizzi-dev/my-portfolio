export type PortfolioSectionKey =
  | "about"
  | "projects"
  | "experience"
  | "skills"
  | "contact";

export interface PortfolioLink {
  label: string;
  href: string;
}

export interface PortfolioHighlight {
  label: string;
  value: string;
}

export interface PortfolioContent {
  identity: {
    name: string;
    title: string;
    summary: string;
  };
  highlights: PortfolioHighlight[];
  links: PortfolioLink[];
  sections: Record<PortfolioSectionKey, string>;
}
