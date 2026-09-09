import type { Metadata } from "next";
import Link from "next/link";
import { KOH_CONVERSION_FACTOR, OIL_SAP_REFERENCE } from "@/lib/oil-sap-reference";
import { JsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Soap-Making Oil SAP Value Reference Chart",
  description:
    "Sourced saponification (SAP) values, NaOH and KOH, for common cold-process soap-making oils and fats: olive, coconut, palm, castor, shea, cocoa butter, and more.",
};

const FAQ = [
  {
    question: "What is a SAP value?",
    answer:
      "The saponification value is the amount of lye (grams of NaOH per gram of oil, in the table below) needed to fully convert that oil into soap. Every oil has its own SAP value based on its specific fatty-acid makeup.",
  },
  {
    question: "How is the KOH value calculated?",
    answer:
      "KOH values here are computed from the sourced NaOH value using the standard molar-mass conversion factor (×1.403), not sourced separately per oil — see this project's lib/oil-sap-reference.ts for the full explanation.",
  },
  {
    question: "Can I trust these values for a large batch?",
    answer:
      "These are cross-corroborated across multiple independent soap-making references and were checked by a domain-expert review (see docs/domain-reference.md for the full breakdown, including two figures the review corrected), but natural oils vary slightly by source and season. For a large or commercial batch, confirm against your specific supplier's own SAP value if they publish one.",
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

      <h1 className="text-3xl font-semibold">Oil SAP Value Reference Chart</h1>
      <p className="mt-3 text-gray-600">
        Saponification values for common cold-process soap-making oils and
        fats.
      </p>

      <table className="mt-6 w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2 pr-4">Oil / fat</th>
            <th className="py-2 pr-4">NaOH SAP (g/g)</th>
            <th className="py-2">KOH SAP (g/g)</th>
          </tr>
        </thead>
        <tbody>
          {OIL_SAP_REFERENCE.map((oil) => (
            <tr key={oil.name} className="border-b border-gray-100 align-top">
              <td className="py-2 pr-4 font-medium">
                {oil.name}
                {oil.note && (
                  <p className="mt-1 text-sm text-gray-500">{oil.note}</p>
                )}
              </td>
              <td className="py-2 pr-4">{oil.sapNaOH.toFixed(3)}</td>
              <td className="py-2">
                {(oil.sapNaOH * KOH_CONVERSION_FACTOR).toFixed(3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-sm text-gray-500">
        Retrieved via web research and cross-corroborated across multiple
        sources, cited in this project&rsquo;s
        <code className="mx-1 rounded bg-gray-100 px-1">
          lib/oil-sap-reference.ts
        </code>
        (see also{" "}
        <code className="mx-1 rounded bg-gray-100 px-1">
          docs/domain-reference.md
        </code>{" "}
        for the full domain-expert review and confidence notes) — not
        independently re-verified against a laboratory titration for every
        entry. Use the{" "}
        <Link href="/lye-calculator" className="underline">
          lye calculator
        </Link>{" "}
        to apply these values to a recipe.
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
