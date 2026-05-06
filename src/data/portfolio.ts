import aboutSource from "@/content/about.md?raw";
import { profileContent } from "@/content/profile";
import type {
  PortfolioContent,
  PortfolioProject,
  PortfolioSection,
} from "@/types/content";

function createSection(
  section: Pick<PortfolioSection, "slug" | "eyebrow" | "title">,
  body: string,
): PortfolioSection {
  return {
    ...section,
    body: body.trim(),
  };
}

export const portfolioContent: PortfolioContent = {
  profile: profileContent,
  sections: [
    createSection(
      { slug: "about", eyebrow: "Apresentacao", title: "Sobre o perfil" },
      aboutSource,
    ),
  ],
};

export const featuredProjects: PortfolioProject[] = [
  {
    id: "fittrack",
    title: "🏋️ FitTrack",
    description:
      "Plataforma completa de rastreamento e gerenciamento de fitness para academias e treinos. O sistema conecta alunos e instrutores, gerencia memberships, registra histórico de sessões e oferece uma base para análises de progresso.",
    image: "/projects/fittrack.jpg",
  },
  {
    id: "victimsim2",
    title: "🚨 VictimSim2",
    description:
      "Simulador inteligente para operações de resposta a desastres, combinando machine learning, algoritmos de busca e visualização em tempo real. Modela cenários de busca e resgate, prioriza vítimas e gera planos de resgate executáveis.",
    image: "/projects/victimsim2.png",
  },
  {
    id: "tickethub",
    title: "🎫 TicketHub",
    description:
      "Plataforma de gerenciamento de eventos e vendas de ingressos, pensada para coordenação de participantes, operação escalável e evolução futura dentro da organização Ticketeira-2026.",
    image: "/projects/tickethub.jpg",
  },
];
