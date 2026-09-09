import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Soap Lye Calculators",
  description:
    "Free calculators for cold-process soap making: lye (NaOH/KOH) and water amounts for your recipe, a water:lye ratio / concentration converter, and a sourced oil SAP value reference chart.",
};

const TOOLS = [
  {
    href: "/lye-calculator",
    title: "Lye calculator",
    description:
      "Enter your recipe's oils and superfat — get the exact NaOH or KOH and water amounts.",
  },
  {
    href: "/water-lye-ratio",
    title: "Water:lye ratio converter",
    description:
      "Convert between water:lye ratio, lye concentration %, and water weight for a known lye amount.",
  },
  {
    href: "/oil-sap-reference",
    title: "Oil SAP value reference chart",
    description:
      "Sourced saponification values for common soap-making oils and fats, NaOH and KOH.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Soap Lye Calculators</h1>
      <p className="mt-3 text-gray-600">
        Free tools for cold-process soap makers — exact lye and water
        amounts for your recipe, ratio/concentration conversions, and a
        sourced oil reference chart.
      </p>

      <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Safety first:</strong> lye (sodium or potassium hydroxide) is
        caustic. Always add lye to water, never water to lye, never use
        aluminum containers or utensils (lye reacts with aluminum to
        release flammable hydrogen gas), and wear sealed goggles and
        gloves. See the{" "}
        <Link href="/lye-calculator" className="underline">
          lye calculator
        </Link>{" "}
        for the full safety notes, including first aid.
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            data-testid={`tool-card-${tool.href.slice(1)}`}
            className="rounded-lg border border-gray-200 p-5 hover:border-gray-400"
          >
            <h2 className="font-semibold text-blue-700">{tool.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{tool.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
