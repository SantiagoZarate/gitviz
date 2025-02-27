import { gitSchema } from "@/lib/git-schema";
import { parseAsJson, useQueryState } from "nuqs";
import { PieChart } from "./components/charts/pie-chart";
import { ContributorsList } from "./components/contributors/contributors-list";

export default function App() {
  const [json, setJson] = useQueryState("json", parseAsJson(gitSchema.parse));

  console.log({ json });

  return (
    <section className="min-h-dvh flex flex-col gap-12 py-20 px-6 max-w-tablet mx-auto w-full">
      <header className="flex flex-col gap-2">
        <h1>Gitviz</h1>
        <p>Visualize git contributors on a repo</p>
      </header>
      <section className="grid grid-cols-2 h-full gap-6">
        <PieChart />
        <ContributorsList contributors={json?.co ?? []} />
      </section>
    </section>
  );
}
