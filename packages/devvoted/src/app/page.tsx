import { ScreenPart } from "./components/ScreenPart";
import styles from "./page.module.css";
import { Button } from "primereact/button";

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */

  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div className="mt-4 p-3 border border-solid border-black">
            <p className="m-0 p-0">Hallo</p>
          </div>
          <ScreenPart />
        </div>
      </div>
    </div>
  );
}
