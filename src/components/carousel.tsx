type Slide = {
  id: string;
  title: string;
  description?: string;
  image?: string;
};

export function Carousel({ slides }: { slides: Slide[] }) {
  if (!slides || slides.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex justify-end gap-4 items-stretch">
        {slides.map((slide) => (
          <article
            key={slide.id}
            className="group relative min-h-[460px] flex-none w-[100px] lg:w-[160px] overflow-hidden rounded-3xl border border-sky-100 bg-white p-4 shadow-sm transition-all duration-400 ease-out hover:w-[680px] hover:-translate-y-1 hover:shadow-[0_28px_80px_-40px_rgba(2,132,199,0.35)] dark:border-slate-700 dark:bg-slate-950 origin-right"
          >
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-16 rounded-md overflow-hidden flex-shrink-0">
                  {slide.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-800" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {slide.title}
                </h3>
              </div>

              <div className="mt-3 overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-[420px] group-hover:opacity-100">
                {slide.description && (
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {slide.description}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
