"use client";

import { useChallenge } from "@/app/context/ChallengeContext";
import classNames from "classnames";
import styles from "./FinalBossIndicator.module.css";
import type { Challenge } from "@/types/db";
import { useEffect } from "react";

type FinalBossIndicatorProps = {
  className?: string;
  challenge?: Challenge | null;
};

export const FinalBossIndicator = ({ className, challenge }: FinalBossIndicatorProps) => {
  // Get access to the challenge context
  const { activeChallenge, setActiveChallenge } = useChallenge();
  
  // Update the context when the challenge prop changes
  useEffect(() => {
    if (challenge) {
      setActiveChallenge(challenge);
    }
  }, [challenge, setActiveChallenge]);
  
  // Use the challenge from props if provided, otherwise use from context
  const currentChallenge = challenge || activeChallenge;
  
  if (!currentChallenge) {
    return null;
  }

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.badge}>
        <span className={styles.title}>FINAL BOSS</span>
        <span className={styles.challengeName}>{currentChallenge.name}</span>
      </div>
      <p className={styles.description}>{currentChallenge.description}</p>
    </div>
  );
};
