"use client";
import styles from "./page.module.css";
import Link from "next/link";

export default function Index() {
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <h1 className="text-center text-4xl uppercase font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Welcome to Devvoted
          </h1>
          <p>
            <Link className="p-button inline-block" href="/polls/vote">
              Vote!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
