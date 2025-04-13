"use client";

import { useEffect } from "react";
import { useChallenge } from "@/app/context/ChallengeContext";
import type { Challenge } from "@/types/db";

type ChallengeUpdaterProps = {
  challenge: Challenge | null;
};

export const ChallengeUpdater = ({ challenge }: ChallengeUpdaterProps) => {
  const { setActiveChallenge } = useChallenge();

  useEffect(() => {
    if (challenge) {
      setActiveChallenge(challenge);
    } else {
      setActiveChallenge(null);
    }
  }, [challenge, setActiveChallenge]);

  // This is a utility component that doesn't render anything
  return null;
};
