import { Contributor } from "@/lib/git-schema";

interface Props {
  contributors: Contributor[];
}

export function ContributorsList({ contributors }: Props) {
  // const handleReºmoveContributor = (name: string) => {
  //   setJson((prevState) => {
  //     const filteredContributors = prevState?.co.filter((co) => co.n !== name);
  //     return { ...prevState, co: filteredContributors };
  //   });
  // };

  return (
    <section className="flex flex-col">
      <header>
        <h3>Contributors</h3>
      </header>
      <ul className="flex flex-col divide-y">
        {contributors.map((contributor) => (
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
                // onClick={() => handleRemoveContributor(contributor.n)}
              >
                x
              </button>
            </section>
          </li>
        ))}
      </ul>
    </section>
  );
}
