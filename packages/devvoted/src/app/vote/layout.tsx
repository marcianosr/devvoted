import Link from "next/link";
import { PropsWithChildren } from "react";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <section>
      <aside>
        <nav>
          <ul>
            <li>
              <Link href={"/vote"}>Vote!</Link>
            </li>
            <li>
              <Link href={"/vote/submit"}>Submit Poll</Link>
            </li>
          </ul>
        </nav>

        <h2>Top Ranking!</h2>
        <dl>
          <dt>CSS</dt>
          <dd>Claes</dd>
          <dt>HTML</dt>
          <dd>Henk</dd>
          <dt>TypeScript</dt>
          <dd>Teun</dd>
          <dt>JavaScript</dt>
          <dd>Jan</dd>
        </dl>
      </aside>
      <main>{children}</main>
    </section>
  );
};

export default Layout;
