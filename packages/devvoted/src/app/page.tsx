"use client";
import { Button } from "primereact/button";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <h1>Welcome to devvoted!</h1>
          <p>
            Please{" "}
            <Button
              label="login"
              onClick={() => {
                router.push("/polls/vote");
              }}
            />{" "}
            to continue!
          </p>
        </div>
      </div>
    </div>
  );
}
