/**
 * AI Detective - Case Database
 * Exact cases, suspects, clues, links, and answers from the Python console project:
 * - Case 1: The Missing Laptop (Computer Laboratory, 2:00 PM - 3:00 PM)
 * - Case 2: The Missing Necklace (Bedroom, Family gathering)
 * - Case 3: Unauthorized Lab Access (College Laboratory, 11:45 PM)
 */

export const CASES = [
  {
    id: 1,
    caseNumber: "CASE 1",
    title: "The Missing Laptop",
    shortDescription: "A laptop disappeared from the Computer Laboratory between 2:00 PM and 3:00 PM.",
    story: "A laptop disappeared from the Computer Laboratory between 2:00 PM and 3:00 PM.\n\nThere are four suspects.\nYou must investigate the evidence and determine what happened.",
    relevantLocation: "Computer Lab",
    
    suspects: {
      "Rahul": {
        location: "Library",
        alibi: "He was studying in the library.",
        access: false,
        motive: false,
        answers: {
          "1": "I was in the library from 1:45 PM to 3:30 PM.",
          "2": "No, I did not enter the Computer Lab.",
          "3": "No, I don't have a laboratory access card.",
          "4": "I don't know anything about the missing laptop."
        }
      },
      "Riya": {
        location: "Outside College",
        alibi: "She left college before the incident.",
        access: false,
        motive: false,
        answers: {
          "1": "I left college at around 1:30 PM.",
          "2": "No, I was already outside the college.",
          "3": "No, I don't have access to that lab.",
          "4": "I only heard about the laptop later."
        }
      },
      "Karan": {
        location: "Near Computer Lab",
        alibi: "He was near the laboratory.",
        access: false,
        motive: true,
        answers: {
          "1": "I was near the Computer Lab around 2:30 PM.",
          "2": "No, I did not enter the lab.",
          "3": "I don't have an access card.",
          "4": "I had no reason to take the laptop."
        }
      },
      "Arjun": {
        location: "Computer Lab",
        alibi: "No confirmed alibi.",
        access: true,
        motive: true,
        answers: {
          "1": "I was working around the Computer Lab.",
          "2": "Yes, I entered the lab.",
          "3": "Yes, I have an access card.",
          "4": "I don't remember exactly what happened."
        }
      }
    },

    clues: {
      "C1": {
        id: "C1",
        text: "The laptop disappeared between 2:00 PM and 3:00 PM.",
        links: ["C2", "C3", "C4"]
      },
      "C2": {
        id: "C2",
        text: "Rahul was confirmed to be in the library.",
        links: []
      },
      "C3": {
        id: "C3",
        text: "Riya left college before 2:00 PM.",
        links: []
      },
      "C4": {
        id: "C4",
        text: "Karan was seen near the Computer Laboratory.",
        links: ["C5"]
      },
      "C5": {
        id: "C5",
        text: "Security camera shows someone entering the Computer Laboratory.",
        links: ["C6"]
      },
      "C6": {
        id: "C6",
        text: "Arjun's access card was used inside the Computer Laboratory.",
        links: []
      }
    }
  },

  {
    id: 2,
    caseNumber: "CASE 2",
    title: "The Missing Necklace",
    shortDescription: "A valuable necklace disappeared during a family gathering.",
    story: "A valuable necklace disappeared during a family gathering.\n\nThe necklace was last seen in the bedroom.\nFour people were present at the house.\nInvestigate the evidence carefully.",
    relevantLocation: "Bedroom",

    suspects: {
      "Aman": {
        location: "Garden",
        alibi: "He was working in the garden.",
        access: false,
        motive: false,
        answers: {
          "1": "I was in the garden.",
          "2": "No, I didn't enter the bedroom.",
          "3": "No, I don't have anything from the bedroom.",
          "4": "I don't know anything about the necklace."
        }
      },
      "Neha": {
        location: "Kitchen",
        alibi: "She was preparing food.",
        access: false,
        motive: true,
        answers: {
          "1": "I was preparing food in the kitchen.",
          "2": "No, I stayed in the kitchen.",
          "3": "No.",
          "4": "I had nothing to do with the necklace."
        }
      },
      "Vikram": {
        location: "Bedroom",
        alibi: "No confirmed alibi.",
        access: true,
        motive: true,
        answers: {
          "1": "I was somewhere inside the house.",
          "2": "Yes, I went near the bedroom.",
          "3": "Yes, I can access the bedroom.",
          "4": "I don't remember seeing the necklace."
        }
      },
      "Sneha": {
        location: "Living Room",
        alibi: "She was talking to guests.",
        access: false,
        motive: false,
        answers: {
          "1": "I was in the living room.",
          "2": "No.",
          "3": "No.",
          "4": "I didn't see anyone take it."
        }
      }
    },

    clues: {
      "C1": {
        id: "C1",
        text: "The necklace was last seen in the bedroom.",
        links: ["C2"]
      },
      "C2": {
        id: "C2",
        text: "Vikram was seen near the bedroom.",
        links: ["C3"]
      },
      "C3": {
        id: "C3",
        text: "Vikram has access to the bedroom.",
        links: ["C4"]
      },
      "C4": {
        id: "C4",
        text: "The bedroom door was opened shortly before the necklace disappeared.",
        links: []
      }
    }
  },

  {
    id: 3,
    caseNumber: "CASE 3",
    title: "Unauthorized Lab Access",
    shortDescription: "Someone accessed a restricted college laboratory at 11:45 PM.",
    story: "Someone accessed a restricted college laboratory at 11:45 PM.\n\nThe security system recorded an entry.\nYou must determine which suspect requires further investigation.",
    relevantLocation: "College",

    suspects: {
      "Dev": {
        location: "Home",
        alibi: "He was at home.",
        access: false,
        motive: false,
        answers: {
          "1": "I was at home.",
          "2": "No, I wasn't at college.",
          "3": "No, I don't have a lab access card.",
          "4": "I know nothing about the incident."
        }
      },
      "Meera": {
        location: "Hostel",
        alibi: "She was in the hostel.",
        access: false,
        motive: false,
        answers: {
          "1": "I was in the hostel.",
          "2": "No, I wasn't on campus.",
          "3": "No.",
          "4": "I was not involved."
        }
      },
      "Rohan": {
        location: "College",
        alibi: "No confirmed alibi.",
        access: true,
        motive: true,
        answers: {
          "1": "I was somewhere on campus.",
          "2": "I may have entered the lab.",
          "3": "Yes, I have an access card.",
          "4": "I don't know why the system recorded my card."
        }
      },
      "Priya": {
        location: "Library",
        alibi: "She was studying in the library.",
        access: false,
        motive: false,
        answers: {
          "1": "I was studying in the library.",
          "2": "No.",
          "3": "No, I don't have access.",
          "4": "I didn't see anything."
        }
      }
    },

    clues: {
      "C1": {
        id: "C1",
        text: "Lab access occurred at 11:45 PM.",
        links: ["C2", "C3"]
      },
      "C2": {
        id: "C2",
        text: "Security camera shows someone entering the laboratory.",
        links: ["C4"]
      },
      "C3": {
        id: "C3",
        text: "Rohan was present on campus.",
        links: ["C4"]
      },
      "C4": {
        id: "C4",
        text: "Rohan possesses a valid laboratory access card.",
        links: ["C5"]
      },
      "C5": {
        id: "C5",
        text: "The access-card system recorded an entry using Rohan's card.",
        links: []
      }
    }
  }
];

export const INTERROGATION_QUESTIONS = [
  { id: "1", text: "Where were you during the incident?" },
  { id: "2", text: "Did you enter the relevant location?" },
  { id: "3", text: "Do you have access to the location?" },
  { id: "4", text: "Do you know anything about the incident?" }
];

export const AI_CONCEPTS = [
  {
    title: "Knowledge Representation",
    shortDesc: "Structuring facts, suspect alibis, access credentials, and locations into an expressive computational model.",
    icon: "database"
  },
  {
    title: "BFS (Breadth-First Search)",
    shortDesc: "Level-by-level state-space exploration of clues using a FIFO Queue to find the shallowest chain of evidence.",
    icon: "layers"
  },
  {
    title: "DFS (Depth-First Search)",
    shortDesc: "Deep-branch graph search using a LIFO Stack to pursue single chains-of-custody to their terminal leads.",
    icon: "git-branch"
  },
  {
    title: "Forward Chaining",
    shortDesc: "Data-driven inference evaluating production rules from verified evidence to deduce suspect culpability.",
    icon: "cpu"
  },
  {
    title: "Rule-Based Reasoning",
    shortDesc: "Production rules (IF location supports alibi / access / motive THEN deduce opportunity) deriving explainable conclusions.",
    icon: "shield"
  },
  {
    title: "State-Space Search",
    shortDesc: "Navigating transitions from the initial crime scene state through evidence clues to reach an accusation goal state.",
    icon: "compass"
  }
];
