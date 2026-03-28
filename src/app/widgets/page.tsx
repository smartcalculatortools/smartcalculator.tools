import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { calculators } from "@/lib/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Embed Widgets",
  description:
    "Embed Smart Calculator Tools on your site with ready-to-use iframe snippets.",
  path: "/widgets",
});

const embedList = [
  { slug: "mortgage", height: 720 },
  { slug: "bmi", height: 720 },
  { slug: "scientific", height: 640 },
];
const siteUrl = getSiteUrl();

export default function WidgetsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-pad">
        <div className="mx-auto w-full max-w-5xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">
            Calculators for your site
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink">Embed widgets</h1>
          <p className="mt-4 text-sm text-muted">
            Use the iframe snippets below to embed calculators on your website.
          </p>

          <div className="mt-8 grid gap-6">
            {embedList.map((item) => {
              const calc = calculators.find((c) => c.slug === item.slug);
              if (!calc) return null;
              return (
                <div
                  key={item.slug}
                  className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="font-display text-2xl text-ink">{calc.name}</h2>
                      <p className="text-sm text-muted">{calc.blurb}</p>
                    </div>
                    <Link
                      href={`/embed/${calc.slug}`}
                      className="rounded-full border border-stroke px-4 py-2 text-xs text-ink"
                    >
                      Preview embed
                    </Link>
                  </div>
                  <div className="mt-4 rounded-2xl border border-stroke/80 bg-white/70 p-4 text-xs text-muted">
                    <code>
                      {`<iframe src="${siteUrl}/embed/${calc.slug}" width="100%" height="${item.height}" style="border:0;" loading="lazy"></iframe>`}
                    </code>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-3xl border border-stroke bg-surface-2 p-6 text-sm text-muted">
            You may customize iframe width and height. Keep attribution to comply with
            our terms of use.
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
