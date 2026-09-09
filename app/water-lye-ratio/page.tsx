import type { Metadata } from "next";
import Link from "next/link";
import { WaterLyeRatioForm } from "../_components/water-lye-ratio-form";
import { JsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Water:Lye Ratio & Concentration Converter",
  description:
    "Convert between water:lye ratio, lye concentration percentage, and the water weight needed for a known lye amount — for translating a soap recipe between conventions.",
};

const FAQ = [
  {
    question: "Why do soap recipes describe water differently?",
    answer:
      "There's no single standard: some give water as a percent of oil weight, some give a water:lye ratio (e.g. 2:1), and some give a lye concentration percentage (lye ÷ total liquid). This tool converts between the ratio and concentration conventions, plus the resulting water weight for a known lye amount.",
  },
  {
    question: "What's a typical lye concentration?",
    answer:
      "Many cold-process recipes use somewhere around 28-33% lye concentration (roughly a 2:1 to 2.5:1 water:lye ratio) as a starting point, though this varies by recipe and technique — always follow your own recipe's figure when you have one. This tool caps concentration at 50% (a 1:1 ratio) — sodium/potassium hydroxide can't reliably dissolve much beyond that in water, and undissolved lye risks a caustic pocket in the finished bar.",
  },
  {
    question: "Does a lower water amount speed up trace?",
    answer:
      "Yes, generally — less water (a higher lye concentration) tends to speed up trace and can shorten cure time, while more water slows both down. It doesn't change the amount of lye needed, only the water.",
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />

      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">
          ← All tools
        </Link>
      </nav>

      <h1 className="text-3xl font-semibold">
        Water:Lye Ratio &amp; Concentration Converter
      </h1>
      <p className="mt-3 text-gray-600">
        Translate a soap recipe&rsquo;s water figure between conventions.
      </p>

      <div className="mt-6">
        <WaterLyeRatioForm />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <dl className="mt-3 space-y-4">
          {FAQ.map((item) => (
            <div key={item.question}>
              <dt className="font-medium text-gray-900">{item.question}</dt>
              <dd className="mt-1 text-gray-600">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
