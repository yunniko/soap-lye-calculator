import type { Metadata } from "next";
import Link from "next/link";
import { LyeCalculatorForm } from "../_components/lye-calculator-form";
import { JsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Cold-Process Soap Lye Calculator",
  description:
    "Calculate the exact NaOH or KOH and water amounts for your cold-process soap recipe from your oils' weights, superfat percentage, and lye type.",
};

const FAQ = [
  {
    question: "Is it safe to add water to lye instead of lye to water?",
    answer:
      "No — always add lye to water, never water to lye. Adding water to solid lye can cause a violent, boiling, splattering reaction. Pour the lye slowly into the water while stirring, in a well-ventilated area.",
  },
  {
    question: "What superfat percentage should I use?",
    answer:
      "5% is a common default for a balanced bar. Lower (0-3%) uses more of the oils for cleansing; higher (8-20%) leaves more unsaponified oil for a more moisturizing, softer bar. This calculator accepts 0-20%, the typical safe range for cold-process soap.",
  },
  {
    question: "Why does this calculator ask for water as a percent of oil weight?",
    answer:
      "It's one common convention (a typical starting point is around 38%). If your recipe instead gives a water:lye ratio or a lye concentration percentage, use the water:lye ratio converter to translate it first.",
  },
  {
    question: "Where do the SAP values come from?",
    answer:
      "See the oil SAP value reference chart for sources and confidence notes on every oil. Always double-check an unusual or less common oil against your supplier's own data sheet before a large batch.",
  },
  {
    question: "Why does it ask for lye purity?",
    answer:
      "Pure NaOH is close to 100%, but commercial KOH commonly ships around 90% pure — treating it as 100% would under-deliver actual alkali. Check your product's label; if it states a purity, enter it here so the weighed-out amount is corrected for it.",
  },
  {
    question: "Why did it reject my recipe with a water-amount error?",
    answer:
      "Sodium and potassium hydroxide can't fully dissolve much above about 50% concentration in water — a recipe with too little water for its lye amount asks for a physically unrealistic solution, and undissolved lye risks a caustic pocket in the finished bar. Increase the water percentage.",
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

      <h1 className="text-3xl font-semibold">Cold-Process Soap Lye Calculator</h1>
      <p className="mt-3 text-gray-600">
        Enter your recipe&rsquo;s oils by weight to get the exact lye and
        water amounts.
      </p>

      <div className="mt-6">
        <LyeCalculatorForm />
      </div>

      <p className="mt-4 text-sm text-gray-500">
        SAP values are sourced and cited in this project&rsquo;s
        <code className="mx-1 rounded bg-gray-100 px-1">
          lib/oil-sap-reference.ts
        </code>
        (see also{" "}
        <code className="mx-1 rounded bg-gray-100 px-1">
          docs/domain-reference.md
        </code>{" "}
        for the full review) — this tool is a reference aid, not a
        substitute for double-checking your own oils and lye against a
        trusted calculator before a large or unfamiliar batch.
      </p>

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
