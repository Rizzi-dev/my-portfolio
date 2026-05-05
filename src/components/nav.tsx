import { portfolioContent } from "@/data";

export function Nav() {
  const { sections } = portfolioContent;

  return (
    <nav aria-label="Seções do site" className="mt-4 sm:mt-6">
      <ul className="flex flex-wrap gap-3">
        {sections.map((s) => (
          <li key={s.slug}>
            <a
              href={`#${s.slug}`}
              className="rounded-full px-3 py-1 text-sm font-medium text-sky-700 hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-slate-800"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
