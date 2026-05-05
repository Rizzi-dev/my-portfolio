import aboutSource from '@/content/about.md?raw'
import experienceSource from '@/content/experience.md?raw'
import { profileContent } from '@/content/profile'
import projectsSource from '@/content/projects.md?raw'
import skillsSource from '@/content/skills.md?raw'
import type { PortfolioContent, PortfolioSection } from '@/types/content'

function createSection(
  section: Pick<PortfolioSection, 'slug' | 'eyebrow' | 'title'>,
  body: string,
): PortfolioSection {
  return {
    ...section,
    body: body.trim(),
  }
}

export const portfolioContent: PortfolioContent = {
  profile: profileContent,
  sections: [
    createSection(
      { slug: 'about', eyebrow: 'Apresentacao', title: 'Sobre o perfil' },
      aboutSource,
    ),
    createSection(
      { slug: 'projects', eyebrow: 'Portfolio', title: 'Projetos selecionados' },
      projectsSource,
    ),
    createSection(
      { slug: 'experience', eyebrow: 'Historico', title: 'Experiencia profissional' },
      experienceSource,
    ),
    createSection(
      { slug: 'skills', eyebrow: 'Competencias', title: 'Tecnologias e foco tecnico' },
      skillsSource,
    ),
  ],
}
