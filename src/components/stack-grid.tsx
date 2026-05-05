import {
  BootstrapIcon,
  CloudServerIcon,
  ComponentIcon,
  CssThreeIcon,
  DatabaseIcon,
  HtmlFiveIcon,
  JavaScriptIcon,
  PythonIcon,
  ReactIcon,
  TailwindcssIcon,
  Typescript01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type StackItem = {
  name: string;
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"];
  accent: string;
  label?: string;
};

const stackItems: StackItem[] = [
  { name: "React", icon: ReactIcon, accent: "from-sky-500/20 to-cyan-400/10" },
  {
    name: "React Native",
    icon: ReactIcon,
    accent: "from-indigo-500/20 to-sky-400/10",
    label: "RN",
  },
  {
    name: "JavaScript",
    icon: JavaScriptIcon,
    accent: "from-amber-400/25 to-yellow-300/10",
    label: "JS",
  },
  {
    name: "TypeScript",
    icon: Typescript01Icon,
    accent: "from-sky-500/25 to-blue-500/10",
    label: "TS",
  },
  {
    name: "HTML",
    icon: HtmlFiveIcon,
    accent: "from-orange-500/25 to-rose-400/10",
  },
  { name: "CSS", icon: CssThreeIcon, accent: "from-sky-500/25 to-cyan-400/10" },
  {
    name: "Tailwind",
    icon: TailwindcssIcon,
    accent: "from-cyan-400/25 to-sky-500/10",
  },
  {
    name: "Bootstrap",
    icon: BootstrapIcon,
    accent: "from-violet-500/20 to-fuchsia-400/10",
  },
  {
    name: "NodeJS",
    icon: CloudServerIcon,
    accent: "from-emerald-500/20 to-teal-400/10",
    label: "Node",
  },
  {
    name: "PostgreSQL",
    icon: DatabaseIcon,
    accent: "from-slate-500/25 to-sky-500/10",
    label: "SQL",
  },
  {
    name: "Python",
    icon: PythonIcon,
    accent: "from-yellow-400/25 to-blue-500/10",
  },
  {
    name: "shadcn/ui",
    icon: ComponentIcon,
    accent: "from-slate-600/25 to-slate-500/10",
    label: "UI",
  },
];

export function StackGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {stackItems.map((stack) => (
        <article
          key={stack.name}
          className={`group relative overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br ${stack.accent} p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 dark:border-slate-700 dark:hover:border-sky-500`}
        >
          <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-400/10 blur-3xl" />
          </div>
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/60 bg-white/70 text-slate-900 shadow-[0_12px_30px_-16px_rgba(2,132,199,0.5)] backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/70 dark:text-white">
              <HugeiconsIcon icon={stack.icon} size={28} strokeWidth={1.7} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold tracking-tight text-slate-950 dark:text-white">
                  {stack.name}
                </h3>
                {stack.label ? (
                  <span className="rounded-full border border-sky-200 bg-white/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-700 dark:border-slate-600 dark:bg-slate-900/70 dark:text-sky-300">
                    {stack.label}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                {`Experiência com ${stack.name} em projetos reais, aplicando boas práticas e padrões de código para entregar soluções eficientes e escaláveis.`}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default StackGrid;
