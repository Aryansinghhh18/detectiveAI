/**
 * AI Engine: Graph Search (BFS & DFS), Forward Chaining, and Rule-Based Reasoning
 * Directly preserves the algorithmic logic and knowledge representation from Aidetective.py.
 */

/**
 * BFS: Breadth-First Search (Level-by-Level exploration using FIFO Queue)
 * Exact algorithm from Aidetective.py:
 * queue = deque(["C1"])
 * visited = set()
 * order = []
 * while queue:
 *   current = queue.popleft()
 *   ...
 *   for neighbour in case["clues"][current]["links"]:
 *     if neighbour not in visited: queue.append(neighbour)
 */
export function computeBFSTrace(clues, startNodeId = "C1") {
  const queue = [startNodeId];
  const visited = new Set();
  const order = [];
  const steps = [];

  steps.push({
    stepIndex: 0,
    type: "INIT",
    currentNode: null,
    queue: [...queue],
    visited: [],
    visitedOrder: [],
    explanation: `BFS initialized with root clue [${startNodeId}]. Queue operates on First-In-First-Out (FIFO) principle.`,
  });

  let stepCount = 1;
  while (queue.length > 0) {
    const current = queue.shift();

    if (visited.has(current)) continue;

    visited.add(current);
    order.push(current);

    steps.push({
      stepIndex: stepCount++,
      type: "VISIT",
      currentNode: current,
      queue: [...queue],
      visited: Array.from(visited),
      visitedOrder: [...order],
      explanation: `Dequeued [${current}]: Examining evidence clue level-by-level: "${clues[current]?.text || ""}"`,
    });

    const neighbours = clues[current]?.links || [];
    for (const neighbour of neighbours) {
      if (!visited.has(neighbour) && !queue.includes(neighbour)) {
        queue.push(neighbour);
        steps.push({
          stepIndex: stepCount++,
          type: "DISCOVER",
          currentNode: current,
          queue: [...queue],
          visited: Array.from(visited),
          visitedOrder: [...order],
          explanation: `Discovered lead ${current} ➔ ${neighbour}: Added [${neighbour}] into BFS queue.`,
        });
      }
    }
  }

  return {
    order,
    steps,
  };
}

/**
 * DFS: Depth-First Search (Deep path exploration using LIFO Stack)
 * Exact algorithm from Aidetective.py:
 * stack = ["C1"]
 * visited = set()
 * order = []
 * while stack:
 *   current = stack.pop()
 *   ...
 *   neighbours = case["clues"][current]["links"]
 *   for neighbour in reversed(neighbours):
 *     if neighbour not in visited: stack.append(neighbour)
 */
export function computeDFSTrace(clues, startNodeId = "C1") {
  const stack = [startNodeId];
  const visited = new Set();
  const order = [];
  const steps = [];

  steps.push({
    stepIndex: 0,
    type: "INIT",
    currentNode: null,
    stack: [...stack],
    visited: [],
    visitedOrder: [],
    explanation: `DFS initialized with root clue [${startNodeId}]. Stack operates on Last-In-First-Out (LIFO) principle.`,
  });

  let stepCount = 1;
  while (stack.length > 0) {
    const current = stack.pop();

    if (visited.has(current)) continue;

    visited.add(current);
    order.push(current);

    steps.push({
      stepIndex: stepCount++,
      type: "VISIT",
      currentNode: current,
      stack: [...stack],
      visited: Array.from(visited),
      visitedOrder: [...order],
      explanation: `Popped [${current}] from stack: Pursuing evidence branch deeply: "${clues[current]?.text || ""}"`,
    });

    const neighbours = clues[current]?.links || [];
    // Python code: for neighbour in reversed(neighbours)
    for (let i = neighbours.length - 1; i >= 0; i--) {
      const neighbour = neighbours[i];
      if (!visited.has(neighbour)) {
        stack.push(neighbour);
        steps.push({
          stepIndex: stepCount++,
          type: "DISCOVER",
          currentNode: current,
          stack: [...stack],
          visited: Array.from(visited),
          visitedOrder: [...order],
          explanation: `Pushed lead [${neighbour}] onto stack via trail ${current} ➔ ${neighbour}.`,
        });
      }
    }
  }

  return {
    order,
    steps,
  };
}

/**
 * AI Observation logic for Interrogation from Aidetective.py:
 * if question == "2" and data["access"]:
 *     "Access information should be checked."
 * elif question == "1":
 *     "The claimed location can be compared with evidence."
 * else:
 *     "Statement added to investigation."
 */
export function getAiObservation(questionId, suspectData) {
  if (questionId === "2" && suspectData.access) {
    return "Access information should be checked.";
  } else if (questionId === "1") {
    return "The claimed location can be compared with evidence.";
  } else {
    return "Statement added to investigation.";
  }
}

/**
 * Forward Chaining Rule Engine from Aidetective.py:
 * Evaluates Rules 1 to 4 across all suspects.
 */
export function runForwardChaining(caseData) {
  const conclusions = [];

  const alibiLocations = [
    "Library",
    "Garden",
    "Kitchen",
    "Living Room",
    "Home",
    "Hostel",
    "Outside College",
  ];

  const nearLocations = [
    "Computer Lab",
    "Near Computer Lab",
    "Bedroom",
    "College",
  ];

  for (const [name, data] of Object.entries(caseData.suspects)) {
    // RULE 1: If location supports an alibi
    if (alibiLocations.includes(data.location)) {
      conclusions.push({
        rule: "RULE 1",
        suspect: name,
        text: `${name} has location information that may support an alibi.`,
        type: "ALIBI",
      });
    }

    // RULE 2: If suspect has access
    if (data.access) {
      conclusions.push({
        rule: "RULE 2",
        suspect: name,
        text: `${name} has access to the relevant location.`,
        type: "ACCESS",
      });
    }

    // RULE 3: If suspect has motive
    if (data.motive) {
      conclusions.push({
        rule: "RULE 3",
        suspect: name,
        text: `${name} has a possible motive.`,
        type: "MOTIVE",
      });
    }

    // RULE 4: If suspect is at or near relevant location
    if (nearLocations.includes(data.location)) {
      conclusions.push({
        rule: "RULE 4",
        suspect: name,
        text: `${name} was at or near the relevant location.`,
        type: "LOCATION",
      });
    }
  }

  return conclusions;
}

/**
 * Current AI Analysis from Aidetective.py:
 * Derives contextual conclusions based on investigated clues.
 */
export function getAiAnalysisReasoning(caseId, investigatedCluesList) {
  const thoughts = [];

  if (caseId === 1) {
    if (investigatedCluesList.includes("C5")) {
      thoughts.push("Evidence connects the security camera with the access-card information.");
    }
    if (investigatedCluesList.includes("C6")) {
      thoughts.push("An access card belonging to a suspect was used at the relevant location.");
    }
    if (investigatedCluesList.includes("C4")) {
      thoughts.push("A suspect was observed near the relevant location.");
    }
  } else if (caseId === 2) {
    if (investigatedCluesList.includes("C2")) {
      thoughts.push("A suspect was observed near the bedroom.");
    }
    if (investigatedCluesList.includes("C3")) {
      thoughts.push("A suspect has confirmed access to the bedroom.");
    }
    if (investigatedCluesList.includes("C4")) {
      thoughts.push("The bedroom door was opened shortly before the necklace disappeared.");
    }
  } else if (caseId === 3) {
    if (investigatedCluesList.includes("C2")) {
      thoughts.push("Security camera shows someone entering the laboratory.");
    }
    if (investigatedCluesList.includes("C4")) {
      thoughts.push("A suspect possesses a valid laboratory access card.");
    }
    if (investigatedCluesList.includes("C5")) {
      thoughts.push("The access-card system recorded an entry using a suspect's card.");
    }
  }

  if (investigatedCluesList.length === 0) {
    thoughts.push("More evidence is required before reasoning can begin.");
  }

  return thoughts;
}

/**
 * Final Accusation Evaluation from Aidetective.py:
 * Evaluates user hypothesis based on location & access.
 */
export function evaluateFinalAccusation(suspectName, suspectData) {
  const alibiLocations = [
    "Library",
    "Garden",
    "Kitchen",
    "Living Room",
    "Home",
    "Hostel",
    "Outside College",
  ];

  const targetLocations = [
    "Computer Lab",
    "Bedroom",
    "College",
  ];

  if (suspectData.access && targetLocations.includes(suspectData.location)) {
    return {
      type: "CONNECTED",
      headline: `${suspectName} is strongly connected to the available evidence.`,
      caveat: "However, the system cannot establish guilt with certainty.",
      statusColor: "emerald",
      badge: "STRONG CONNECTION",
    };
  } else if (alibiLocations.includes(suspectData.location)) {
    return {
      type: "ALIBI",
      headline: `${suspectName} has information that may support an alibi.`,
      caveat: "The available evidence does not strongly support this hypothesis.",
      statusColor: "amber",
      badge: "ALIBI SUPPORTED",
    };
  } else {
    return {
      type: "INSUFFICIENT",
      headline: "The evidence is insufficient to establish a strong connection.",
      caveat: "The available evidence does not support direct involvement.",
      statusColor: "slate",
      badge: "INSUFFICIENT EVIDENCE",
    };
  }
}
