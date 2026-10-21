import Image from "next/image";
import type { Brand } from "@/data/brands";

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <li className="group grid h-[clamp(8.5rem,13vw,12rem)] w-[clamp(14rem,22vw,21rem)] shrink-0 snap-start place-items-center rounded-[28px] border border-line bg-white px-10 transition duration-500 ease-out-expo hover:-translate-y-1 hover:border-ink/15 hover:shadow-[0_20px_40px_-28px_rgba(0,0,0,0.25)]">
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt={`${brand.name} logo`}
          width={220}
          height={88}
          className="max-h-14 w-auto object-contain opacity-80 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0"
        />
      ) : (
        <div className="text-center">
          <span className="block font-display text-[clamp(1.25rem,1.8vw,1.75rem)] font-semibold tracking-[-0.03em] text-ink/75 transition-colors group-hover:text-ink">
            {brand.name}
          </span>
          <span className="mt-2 inline-block rounded-full border border-dashed border-ink/20 px-2.5 py-0.5 font-label text-[10px] uppercase tracking-[0.14em] text-ink-2">
            Logo placeholder
          </span>
        </div>
      )}
    </li>
  );
}
