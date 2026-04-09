'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

export type StackedCoverageItem = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
};

type StackedCoverageCarouselProps = {
  items: StackedCoverageItem[];
  contactHref?: string;
};

export function StackedCoverageCarousel({ items, contactHref = '#contato' }: StackedCoverageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const normalizedItems = useMemo(() => items.filter(Boolean), [items]);

  if (!normalizedItems.length) {
    return null;
  }

  const activeItem = normalizedItems[activeIndex];

  const previous = () => {
    setActiveIndex((prev) => (prev - 1 + normalizedItems.length) % normalizedItems.length);
  };

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % normalizedItems.length);
  };

  return (
    <div className="relative isolate pb-8 pt-2">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
        <div
          key={activeItem.id}
          className="absolute inset-0 transition-all duration-300 ease-out"
          style={{
            backgroundImage: `url(${activeItem.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(26px)',
            opacity: 0.4,
          }}
        />
        <div className="absolute inset-0 bg-[#f6ecdf]/72" />
      </div>

      <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={previous}
          aria-label="Cobertura anterior"
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c9ae7d] bg-[#f7efe2] text-2xl font-semibold text-[#5d3b1f] shadow-sm transition hover:bg-[#efe0c9]"
        >
          ‹
        </button>

        <div className="relative w-full max-w-5xl overflow-hidden rounded-[30px] border border-[#dcc8a0] bg-[#efe2cf]/60 p-3 shadow-[0_26px_56px_-34px_rgba(57,40,19,0.45)] sm:p-4">
          <div className="relative aspect-[16/10] w-full rounded-[24px] bg-[#f8f0e2]">
            <div key={activeItem.id} className="absolute inset-0 transition-opacity duration-300 ease-out">
              <Image
                src={activeItem.image}
                alt={activeItem.title}
                fill
                sizes="(max-width: 768px) 90vw, 900px"
                className="object-contain object-center"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {normalizedItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-xl border ${
                  index === activeIndex ? 'border-[#a87c42] ring-2 ring-[#d8bd8d]' : 'border-[#d8c8a9]'
                }`}
                aria-label={`Selecionar cobertura ${item.title}`}
              >
                <Image src={item.image} alt={item.title} fill sizes="96px" className="object-cover object-center" />
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Próxima cobertura"
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c9ae7d] bg-[#f7efe2] text-2xl font-semibold text-[#5d3b1f] shadow-sm transition hover:bg-[#efe0c9]"
        >
          ›
        </button>
      </div>

      <div
        key={activeItem.id}
        className="relative z-20 mx-auto mt-8 w-[min(92vw,720px)] rounded-[26px] border border-[#dcc8a0] bg-white/92 p-6 text-center shadow-[0_24px_46px_-34px_rgba(57,40,19,0.6)] transition-all duration-300 ease-out"
      >
        <h3 className="text-3xl font-semibold text-[#3f2411]">{activeItem.title}</h3>
        <p className="mt-3 text-base leading-7 text-[#5f4d3e]">{activeItem.subtitle}</p>
        <a
          href={contactHref}
          className="mt-5 inline-flex rounded-full border border-[#a87c42] bg-[#f7efe3] px-6 py-2.5 text-sm font-semibold text-[#2a2018] transition hover:bg-[#efe2cf]"
        >
          Quero esta cobertura
        </a>
      </div>
    </div>
  );
}
