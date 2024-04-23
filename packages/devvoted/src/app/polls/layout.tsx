import Link from "next/link";
import { PropsWithChildren } from "react";
import { ButtonGroup } from "primereact/buttongroup";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { redirect } from "next/navigation";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const rankings: { category: string; name: string; pid: string }[] = [
    { category: "CSS", name: "Claes Soos", pid: "claes-soos" },
    { category: "HTML", name: "Henk Te Maal", pid: "henk-te-maal" },
    { category: "TypeScript", name: "Teun Scribe", pid: "teun-scribe" },
    { category: "JavaScript", name: "Jan Scribe", pid: "jan-scribe" },
  ];

  return (
    <section className="flex flex-col container mx-auto">
      <header className="h-20">
        <div className="shadow flex flex-row gap-4 p-1">
          <div className="w-10 h-10 p-2 shadow-sm text-center bg-slate-200 text-2xl">
            🤪
          </div>
          <p>My Name</p>
          <p>Score: 1337</p>
          <p>Rating: 85%</p>
          <div className="flex-1"></div>
          <form
            action={async () => {
              "use server";

              redirect("/");
            }}
          >
            <Button label="Logout" size="small"></Button>
          </form>
        </div>
      </header>
      <div className="flex flex-row gap-4 flex-wrap">
        <aside className="w-60">
          <nav>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href={"/polls/vote"} className="p-button">
                  Vote! <Badge value="1"></Badge>
                </Link>
              </li>
              <li>
                <Link href={"/polls/submit"} className="p-button">
                  Submit Poll
                </Link>
              </li>
            </ul>
          </nav>

          <h2 className="mt-4 mb-2">Top Ranking!</h2>

          <div className="flex flex-col gap-2">
            {rankings.map(({ category, name, pid }) => (
              <ButtonGroup key={category}>
                <Link
                  href={`/polls/ranking/${category}`}
                  className="p-button p-component rounded-l-full p-button-sm w-2/5"
                >
                  <span className="p-button-label p-c">{category}</span>
                </Link>
                <Link
                  href={`/profile/${pid}`}
                  className="p-button p-component rounded-r-full p-button-sm p-button-outlined w-3/5"
                >
                  <span className="p-button-label p-c">{name}</span>
                </Link>
              </ButtonGroup>
            ))}
          </div>
        </aside>
        <main
          className="
          flex-1
          md:flex-column
        "
        >
          {children}
        </main>
      </div>
    </section>
  );
};

export default Layout;
