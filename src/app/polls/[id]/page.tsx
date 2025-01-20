"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { getPoll } from "@/services/polls";
import type { Poll } from "@/types/database";

export default function PollPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const pollId = params.id as string;
  
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPoll() {
      try {
        console.log("Loading poll:", pollId);
        const pollData = await getPoll(pollId);
        console.log("Loaded poll data:", pollData);
        setPoll(pollData);
      } catch (err) {
        console.error("Error loading poll:", err);
        setError(err instanceof Error ? err.message : "Failed to load poll");
      } finally {
        setLoading(false);
      }
    }

    loadPoll();
  }, [pollId]);

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-yellow-800 font-semibold">Poll Not Found</h2>
          <p className="text-yellow-600">The requested poll could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{poll.question}</h1>
      
      <div className="space-y-4 mb-8">
        {poll.options.map((option) => (
          <button
            key={option.id}
            className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {option.text}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Total responses: {poll.totalResponses}
        </span>
        <Button disabled={!user} variant="primary">
          Submit
        </Button>
      </div>
    </section>
  );
}
