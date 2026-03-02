"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function SeedInitializer() {
  const seedTasks = useMutation(api.tasks.seed);
  const seedMemories = useMutation(api.memories.seed);
  const seedAgents = useMutation(api.agents.seed);
  const seedLogs = useMutation(api.logs.seed);
  const seedProducts = useMutation(api.products.seed);
  const hasSeeded = useRef(false);

  useEffect(() => {
    if (hasSeeded.current) return;
    hasSeeded.current = true;

    const runSeed = async () => {
      try {
        await Promise.all([
          seedTasks({}),
          seedMemories({}),
          seedAgents({}),
          seedLogs({}),
          seedProducts({}),
        ]);
      } catch (err) {
        // Seed already ran or error — safe to ignore
        console.log("Seed skipped or already complete:", err);
      }
    };

    runSeed();
  }, [seedTasks, seedMemories, seedAgents, seedLogs, seedProducts]);

  return null;
}
