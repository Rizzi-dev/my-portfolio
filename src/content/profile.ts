import type { PortfolioProfile } from "@/types/content";

export const profileContent: PortfolioProfile = {
  name: "Seu Nome",
  title: "Desenvolvedor Full Stack",
  summary:
    "Base inicial do portfólio para centralizar dados do currículo, projetos e contatos em um único lugar.",
  photo: "/profile.jpg",
  highlights: [
    { label: "Foco atual", value: "Front-end com React" },
    { label: "Stack", value: "Vite, Tailwind e shadcn" },
    { label: "Objetivo", value: "Evitar conteúdo hardcoded nas telas" },
  ],
  links: [
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Email", href: "#" },
  ],
};
