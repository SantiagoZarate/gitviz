import LZString from "lz-string";
import { parseAsJson, useQueryState } from "nuqs";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  // Contributors
  co: z.array(
    z.object({
      // Name
      n: z.string(),
      // Commits
      c: z.coerce.number(),
      // Email
      e: z.string().email(),
      // Lines of code
      loc: z.coerce.number(),
      // Removed
      rm: z.coerce.number(),
    })
  ),
});

type FilterState = {
  order: "ASC" | "DESC";
};

export default function App() {
  const [json, setJson] = useQueryState("json", parseAsJson(schema.parse));
  const [filter, setFilter] = useState<FilterState>({ order: "DESC" });

  const compressed = LZString.compressToEncodedURIComponent(
    JSON.stringify(json)
  );

  const handleRemoveContributor = (name: string) => {
    setJson((prevState) => {
      const filteredContributors = prevState?.co.filter((co) => co.n !== name);
      return { ...prevState, co: filteredContributors };
    });
  };

  return (
    <section className="min-h-dvh flex flex-col gap-12 items-center justify-center px-6 max-w-[600px]">
      <header>
        <h1>Gitviz</h1>
        <p>Visualize git contributors on a repo</p>
      </header>
      <ul className="flex flex-col divide-y">
        {json?.co.map((contributor) => (
          <li className="flex justify-between items-center p-2 gap-12">
            <section className="flex flex-col gap-1">
              <section className="flex flex-col gap-1">
                <p>{contributor.n}</p>
                <p className="text-xs">{contributor.e}</p>
              </section>
              <section className="flex gap-2">
                <span className="text-green-600 bg-green-200 rounded-full text-xs px-2 py-1">
                  {contributor.loc}
                </span>
                <span className="text-red-600 bg-red-200 rounded-full text-xs px-2 py-1">
                  {contributor.rm}
                </span>
              </section>
            </section>
            <section className="">
              <p>{contributor.c}</p>
              <button
                className="bg-red-200 rounded-full p-2"
                onClick={() => handleRemoveContributor(contributor.n)}
              >
                x
              </button>
            </section>
          </li>
        ))}
      </ul>
      {JSON.stringify(json, null, 2).length}
      <hr />
      {compressed.length}
    </section>
  );
}
