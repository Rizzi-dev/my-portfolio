import { useEffect, useState } from "react";

type Slide = {
  id: string;
  title: string;
  excerpt?: string;
};

export function Carousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s) => (
          <div key={s.id} className="w-full flex-shrink-0 px-4 py-6">
            <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {s.title}
              </h3>
              {s.excerpt && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {s.excerpt}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
        <button
          type="button"
          onClick={() =>
            setIndex((i) => (i - 1 + slides.length) % slides.length)
          }
          className="pointer-events-auto rounded-full bg-white/80 p-2 text-sm shadow dark:bg-slate-800/80"
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % slides.length)}
          className="pointer-events-auto rounded-full bg-white/80 p-2 text-sm shadow dark:bg-slate-800/80"
          aria-label="Próximo"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default Carousel;
