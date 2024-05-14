import { PropsWithChildren } from "react";
import { Header } from "../ui/header";
import { fetchUserDetails } from "../lib/user";

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const userDetails = await fetchUserDetails();

  return (
    <section className="flex flex-col container mx-auto">
      <Header {...userDetails} />
      <div className="flex flex-row gap-4 flex-wrap">
        <aside className="w-60">
          <h2 className="mt-4 mb-2">Top Ranking!</h2>
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
