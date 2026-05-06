import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { Nav } from "@/components/nav";
import Carousel from "@/components/carousel";
import StackGrid from "@/components/stack-grid";
import { MarkdownContent } from "@/components/content/markdown-content";
import { featuredProjects, portfolioContent } from "@/data";
import aboutSource from "@/content/about.md?raw";

type ThemeMode = "light" | "dark";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem("theme");

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function HomePage() {
  const { profile } = portfolioContent;
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [pointer, setPointer] = useState({ x: 50, y: 18 });

  const backgroundStyle = useMemo(
    () =>
      ({
        ["--mouse-x" as string]: `${pointer.x}%`,
        ["--mouse-y" as string]: `${pointer.y}%`,
      }) as CSSProperties,
    [pointer],
  );

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <main className="min-h-screen px-4 py-6 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <div
        className="mx-auto relative flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-sky-200/70 bg-white/80 shadow-[0_24px_80px_-40px_rgba(2,132,199,0.45)] backdrop-blur dark:border-slate-700 dark:bg-slate-950/80 dark:shadow-[0_24px_80px_-40px_rgba(2,132,199,0.3)]"
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - bounds.left) / bounds.width) * 100;
          const y = ((event.clientY - bounds.top) / bounds.height) * 100;
          setPointer({
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
          });
        }}
        onPointerLeave={() => setPointer({ x: 50, y: 18 })}
      >
        <div className="tech-bg" aria-hidden="true" style={backgroundStyle} />
        <div className="relative z-10">
          <header className="border-b border-sky-100 px-6 py-5 dark:border-slate-800 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-600 dark:text-sky-400">
                  Portfólio dev
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                  {profile.name}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
                  {profile.title}
                </p>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                  {profile.summary}
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 self-start">
                <button
                  type="button"
                  onClick={() =>
                    setTheme((currentTheme) =>
                      currentTheme === "dark" ? "light" : "dark",
                    )
                  }
                  className="inline-flex items-center gap-3 rounded-full border border-sky-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-500 dark:hover:text-sky-300"
                  aria-label={
                    theme === "dark"
                      ? "Ativar modo claro"
                      : "Ativar modo escuro"
                  }
                >
                  {theme === "dark" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414M18.364 18.364l-1.414-1.414M7.05 7.05L5.636 5.636M12 7a5 5 0 100 10 5 5 0 000-10z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-sky-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                      />
                    </svg>
                  )}
                  <span className="sr-only">Alternar tema</span>
                </button>

                {profile.photo && (
                  <div className="w-24 h-24 rounded-xl border-2 border-sky-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    <img
                      src={profile.photo}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </header>

          <Nav />

          <section className="grid gap-4 border-b border-sky-100 px-6 py-6 dark:border-slate-800 sm:grid-cols-3 sm:px-8">
            {profile.highlights.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                  {item.label}
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                  {item.value}
                </p>
              </article>
            ))}
          </section>

          {/* Projects Carousel */}
          <section className="border-b border-sky-100 px-6 py-6 dark:border-slate-800 sm:px-8">
            <article className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                Portfolio
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Projetos selecionados
              </h2>
              <div className="mt-4">
                <Carousel slides={featuredProjects} />
              </div>
            </article>
          </section>

          {/* About Section */}
          <section className="border-b border-sky-100 px-6 py-6 dark:border-slate-800 sm:px-8">
            <article className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                Apresentacao
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Sobre o perfil
              </h2>
              <div className="mt-4">
                <MarkdownContent content={aboutSource} />
              </div>
            </article>
          </section>

          <section className="grid gap-6 border-b border-sky-100 px-6 py-6 dark:border-slate-800 sm:px-8">
            <article className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                Stacks
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Tech Stack
              </h2>
              <div className="mt-4">
                <StackGrid />
              </div>
            </article>
          </section>

          <section className="grid flex-1 gap-6 px-6 py-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div className="space-y-6" />
            <aside className="space-y-6">
              <article className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                  Contatos
                </h2>
                <ul className="mt-4 space-y-3">
                  {profile.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-300"
                      >
                        <span className="h-2 w-2 rounded-full bg-sky-500" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-3xl border border-sky-100 bg-sky-500 px-6 py-6 text-white shadow-[0_20px_60px_-30px_rgba(14,165,233,0.8)] dark:border-sky-900 dark:bg-sky-600">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">
                  Próximo passo
                </h2>
                <p className="mt-4 text-sm leading-6 text-sky-50">
                  Agora o conteúdo principal está em Markdown. Quando quiser
                  editar, basta mexer nos arquivos em src/content sem tocar na
                  estrutura da tela.
                </p>
              </article>
            </aside>
          </section>
        </div>
      </div>
    </main>
  );
}
