# ============================================================
#              🕵️ INTERACTIVE AI DETECTIVE
# ============================================================
# AI Concepts:
# 1. Knowledge Representation
# 2. BFS
# 3. DFS
# 4. Forward Chaining
# 5. Rule-Based Reasoning
# 6. State-Space Search
# ============================================================

from collections import deque


# ============================================================
# CASE DATABASE
# ============================================================

cases = {

    1: {
        "title": "The Missing Laptop",

        "story": """
A laptop disappeared from the Computer Laboratory
between 2:00 PM and 3:00 PM.

There are four suspects.
You must investigate the evidence and determine
what happened.
""",

        "suspects": {

            "Rahul": {
                "location": "Library",
                "alibi": "He was studying in the library.",
                "access": False,
                "motive": False,

                "answers": {
                    "1": "I was in the library from 1:45 PM to 3:30 PM.",
                    "2": "No, I did not enter the Computer Lab.",
                    "3": "No, I don't have a laboratory access card.",
                    "4": "I don't know anything about the missing laptop."
                }
            },

            "Riya": {
                "location": "Outside College",
                "alibi": "She left college before the incident.",
                "access": False,
                "motive": False,

                "answers": {
                    "1": "I left college at around 1:30 PM.",
                    "2": "No, I was already outside the college.",
                    "3": "No, I don't have access to that lab.",
                    "4": "I only heard about the laptop later."
                }
            },

            "Karan": {
                "location": "Near Computer Lab",
                "alibi": "He was near the laboratory.",
                "access": False,
                "motive": True,

                "answers": {
                    "1": "I was near the Computer Lab around 2:30 PM.",
                    "2": "No, I did not enter the lab.",
                    "3": "I don't have an access card.",
                    "4": "I had no reason to take the laptop."
                }
            },

            "Arjun": {
                "location": "Computer Lab",
                "alibi": "No confirmed alibi.",
                "access": True,
                "motive": True,

                "answers": {
                    "1": "I was working around the Computer Lab.",
                    "2": "Yes, I entered the lab.",
                    "3": "Yes, I have an access card.",
                    "4": "I don't remember exactly what happened."
                }
            }
        },

        "clues": {

            "C1": {
                "text": "The laptop disappeared between 2:00 PM and 3:00 PM.",
                "links": ["C2", "C3", "C4"]
            },

            "C2": {
                "text": "Rahul was confirmed to be in the library.",
                "links": []
            },

            "C3": {
                "text": "Riya left college before 2:00 PM.",
                "links": []
            },

            "C4": {
                "text": "Karan was seen near the Computer Laboratory.",
                "links": ["C5"]
            },

            "C5": {
                "text": "Security camera shows someone entering the Computer Laboratory.",
                "links": ["C6"]
            },

            "C6": {
                "text": "Arjun's access card was used inside the Computer Laboratory.",
                "links": []
            }
        }
    },


    # ========================================================
    # CASE 2
    # ========================================================

    2: {
        "title": "The Missing Necklace",

        "story": """
A valuable necklace disappeared during a family gathering.

The necklace was last seen in the bedroom.
Four people were present at the house.
Investigate the evidence carefully.
""",

        "suspects": {

            "Aman": {
                "location": "Garden",
                "alibi": "He was working in the garden.",
                "access": False,
                "motive": False,

                "answers": {
                    "1": "I was in the garden.",
                    "2": "No, I didn't enter the bedroom.",
                    "3": "No, I don't have anything from the bedroom.",
                    "4": "I don't know anything about the necklace."
                }
            },

            "Neha": {
                "location": "Kitchen",
                "alibi": "She was preparing food.",
                "access": False,
                "motive": True,

                "answers": {
                    "1": "I was preparing food in the kitchen.",
                    "2": "No, I stayed in the kitchen.",
                    "3": "No.",
                    "4": "I had nothing to do with the necklace."
                }
            },

            "Vikram": {
                "location": "Bedroom",
                "alibi": "No confirmed alibi.",
                "access": True,
                "motive": True,

                "answers": {
                    "1": "I was somewhere inside the house.",
                    "2": "Yes, I went near the bedroom.",
                    "3": "Yes, I can access the bedroom.",
                    "4": "I don't remember seeing the necklace."
                }
            },

            "Sneha": {
                "location": "Living Room",
                "alibi": "She was talking to guests.",
                "access": False,
                "motive": False,

                "answers": {
                    "1": "I was in the living room.",
                    "2": "No.",
                    "3": "No.",
                    "4": "I didn't see anyone take it."
                }
            }
        },

        "clues": {

            "C1": {
                "text": "The necklace was last seen in the bedroom.",
                "links": ["C2"]
            },

            "C2": {
                "text": "Vikram was seen near the bedroom.",
                "links": ["C3"]
            },

            "C3": {
                "text": "Vikram has access to the bedroom.",
                "links": ["C4"]
            },

            "C4": {
                "text": "The bedroom door was opened shortly before the necklace disappeared.",
                "links": []
            }
        }
    },


    # ========================================================
    # CASE 3
    # ========================================================

    3: {
        "title": "Unauthorized Lab Access",

        "story": """
Someone accessed a restricted college laboratory at 11:45 PM.

The security system recorded an entry.
You must determine which suspect requires
further investigation.
""",

        "suspects": {

            "Dev": {
                "location": "Home",
                "alibi": "He was at home.",
                "access": False,
                "motive": False,

                "answers": {
                    "1": "I was at home.",
                    "2": "No, I wasn't at college.",
                    "3": "No, I don't have a lab access card.",
                    "4": "I know nothing about the incident."
                }
            },

            "Meera": {
                "location": "Hostel",
                "alibi": "She was in the hostel.",
                "access": False,
                "motive": False,

                "answers": {
                    "1": "I was in the hostel.",
                    "2": "No, I wasn't on campus.",
                    "3": "No.",
                    "4": "I was not involved."
                }
            },

            "Rohan": {
                "location": "College",
                "alibi": "No confirmed alibi.",
                "access": True,
                "motive": True,

                "answers": {
                    "1": "I was somewhere on campus.",
                    "2": "I may have entered the lab.",
                    "3": "Yes, I have an access card.",
                    "4": "I don't know why the system recorded my card."
                }
            },

            "Priya": {
                "location": "Library",
                "alibi": "She was studying in the library.",
                "access": False,
                "motive": False,

                "answers": {
                    "1": "I was studying in the library.",
                    "2": "No.",
                    "3": "No, I don't have access.",
                    "4": "I didn't see anything."
                }
            }
        },

        "clues": {

            "C1": {
                "text": "Lab access occurred at 11:45 PM.",
                "links": ["C2", "C3"]
            },

            "C2": {
                "text": "Security camera shows someone entering the laboratory.",
                "links": ["C4"]
            },

            "C3": {
                "text": "Rohan was present on campus.",
                "links": ["C4"]
            },

            "C4": {
                "text": "Rohan possesses a valid laboratory access card.",
                "links": ["C5"]
            },

            "C5": {
                "text": "The access-card system recorded an entry using Rohan's card.",
                "links": []
            }
        }
    }
}


# ============================================================
# GLOBAL INVESTIGATION MEMORY
# ============================================================

investigated_clues = []
interrogated_suspects = []


# ============================================================
# HEADER
# ============================================================

def header():

    print("\n" + "=" * 65)
    print("              🕵️ INTERACTIVE AI DETECTIVE")
    print("=" * 65)


# ============================================================
# CASE SELECTION
# ============================================================

def select_case():

    print("\nAVAILABLE CASES")
    print("-" * 65)

    for number, case in cases.items():

        print(number, ".", case["title"])

    print("0. Exit")

    while True:

        try:

            choice = int(input("\nSelect case: "))

            if choice == 0:
                return None

            if choice in cases:
                return cases[choice]

            print("Invalid choice.")

        except ValueError:

            print("Please enter a number.")


# ============================================================
# DISPLAY CASE
# ============================================================

def display_case(case):

    print("\n" + "=" * 65)
    print(case["title"].upper())
    print("=" * 65)

    print(case["story"])

    print("\nSUSPECTS")
    print("-" * 65)

    for name, data in case["suspects"].items():

        print("\n", name)
        print("Location :", data["location"])
        print("Alibi    :", data["alibi"])


# ============================================================
# DISPLAY EVIDENCE
# ============================================================

def display_evidence(case):

    print("\n" + "=" * 65)
    print("AVAILABLE EVIDENCE")
    print("=" * 65)

    for clue_id, clue in case["clues"].items():

        if clue_id in investigated_clues:

            print("[INVESTIGATED]", clue_id, "→", clue["text"])

        else:

            print("[NEW]         ", clue_id, "→", clue["text"])


# ============================================================
# EXAMINE CLUE
# ============================================================

def examine_clue(case):

    display_evidence(case)

    clue_id = input(
        "\nEnter evidence ID to examine (example C1): "
    ).upper()

    if clue_id not in case["clues"]:

        print("\nEvidence not found.")

        return

    if clue_id not in investigated_clues:

        investigated_clues.append(clue_id)

    clue = case["clues"][clue_id]

    print("\n" + "-" * 65)
    print("EVIDENCE:", clue_id)
    print("-" * 65)

    print(clue["text"])

    if clue["links"]:

        print("\nThis evidence leads to:")

        for link in clue["links"]:

            print("→", link)

    else:

        print("\nNo directly connected evidence found.")


# ============================================================
# BFS
# ============================================================

def bfs(case):

    print("\n" + "=" * 65)
    print("             BFS EVIDENCE SEARCH")
    print("=" * 65)

    queue = deque(["C1"])

    visited = set()

    order = []

    while queue:

        current = queue.popleft()

        if current in visited:
            continue

        visited.add(current)

        order.append(current)

        for neighbour in case["clues"][current]["links"]:

            if neighbour not in visited:

                queue.append(neighbour)

    print("\nAI is exploring evidence level-by-level...\n")

    for i, clue in enumerate(order, 1):

        print(
            i,
            ".",
            clue,
            "→",
            case["clues"][clue]["text"]
        )

    return order


# ============================================================
# DFS
# ============================================================

def dfs(case):

    print("\n" + "=" * 65)
    print("             DFS EVIDENCE SEARCH")
    print("=" * 65)

    stack = ["C1"]

    visited = set()

    order = []

    while stack:

        current = stack.pop()

        if current in visited:
            continue

        visited.add(current)

        order.append(current)

        neighbours = case["clues"][current]["links"]

        for neighbour in reversed(neighbours):

            if neighbour not in visited:

                stack.append(neighbour)

    print("\nAI is following evidence paths deeply...\n")

    for i, clue in enumerate(order, 1):

        print(
            i,
            ".",
            clue,
            "→",
            case["clues"][clue]["text"]
        )

    return order


# ============================================================
# INTERROGATE SUSPECT
# ============================================================

def interrogate(case):

    names = list(case["suspects"].keys())

    print("\n" + "=" * 65)
    print("              SUSPECT INTERROGATION")
    print("=" * 65)

    for i, name in enumerate(names, 1):

        print(i, ".", name)

    try:

        choice = int(
            input("\nChoose suspect: ")
        )

        if choice < 1 or choice > len(names):

            print("Invalid choice.")

            return

    except ValueError:

        print("Enter a valid number.")

        return

    suspect = names[choice - 1]

    if suspect not in interrogated_suspects:

        interrogated_suspects.append(suspect)

    data = case["suspects"][suspect]

    print("\nInterrogating:", suspect)

    print("\nQuestions:")

    print("1. Where were you during the incident?")
    print("2. Did you enter the relevant location?")
    print("3. Do you have access to the location?")
    print("4. Do you know anything about the incident?")

    question = input(
        "\nChoose question (1-4): "
    )

    if question in data["answers"]:

        print("\n" + suspect + ":")

        print(
            '"' +
            data["answers"][question] +
            '"'
        )

        print("\nAI observes the statement.")

        if question == "2" and data["access"]:

            print(
                "→ AI observation: "
                "Access information should be checked."
            )

        elif question == "1":

            print(
                "→ AI observation: "
                "The claimed location can be compared with evidence."
            )

        else:

            print(
                "→ AI observation: "
                "Statement added to investigation."
            )

    else:

        print("Invalid question.")


# ============================================================
# FORWARD CHAINING
# ============================================================

def forward_chaining(case):

    print("\n" + "=" * 65)
    print("             AI REASONING ENGINE")
    print("=" * 65)

    conclusions = []

    for name, data in case["suspects"].items():

        # RULE 1
        if data["location"] in [
            "Library",
            "Garden",
            "Kitchen",
            "Living Room",
            "Home",
            "Hostel",
            "Outside College"
        ]:

            conclusions.append(
                name +
                " has location information that may support an alibi."
            )

        # RULE 2
        if data["access"]:

            conclusions.append(
                name +
                " has access to the relevant location."
            )

        # RULE 3
        if data["motive"]:

            conclusions.append(
                name +
                " has a possible motive."
            )

        # RULE 4
        if data["location"] in [
            "Computer Lab",
            "Near Computer Lab",
            "Bedroom",
            "College"
        ]:

            conclusions.append(
                name +
                " was at or near the relevant location."
            )

    print("\nAI-derived facts:\n")

    for conclusion in conclusions:

        print("→", conclusion)

    print(
        "\nThe AI combines these facts with the "
        "investigated evidence."
    )


# ============================================================
# AI ANALYSIS
# ============================================================

def ai_analysis(case):

    print("\n" + "=" * 65)
    print("             CURRENT AI ANALYSIS")
    print("=" * 65)

    print("\nInvestigated evidence:")

    if not investigated_clues:

        print("No evidence has been investigated yet.")

    else:

        for clue_id in investigated_clues:

            print(
                "✓",
                clue_id,
                "→",
                case["clues"][clue_id]["text"]
            )

    print("\nInterrogated suspects:")

    if not interrogated_suspects:

        print("No suspects interrogated yet.")

    else:

        for suspect in interrogated_suspects:

            print("✓", suspect)

    print("\nAI reasoning:\n")

    # Check important evidence

    if "C5" in investigated_clues:

        print(
            "→ Evidence connects the security camera "
            "with the access-card information."
        )

    if "C6" in investigated_clues:

        print(
            "→ An access card belonging to a suspect "
            "was used at the relevant location."
        )

    if "C4" in investigated_clues:

        print(
            "→ A suspect was observed near the relevant location."
        )

    if not investigated_clues:

        print(
            "→ More evidence is required before reasoning "
            "can begin."
        )

    print(
        "\nAI status: Investigation is still in progress."
    )


# ============================================================
# FINAL ACCUSATION
# ============================================================

def final_accusation(case):

    print("\n" + "=" * 65)
    print("               FINAL ACCUSATION")
    print("=" * 65)

    names = list(case["suspects"].keys())

    for i, name in enumerate(names, 1):

        print(i, ".", name)

    try:

        choice = int(
            input("\nWho do you believe is responsible? ")
        )

        if choice < 1 or choice > len(names):

            print("Invalid choice.")

            return

    except ValueError:

        print("Enter a valid number.")

        return

    selected = names[choice - 1]

    print("\nYou selected:", selected)

    print("\nAI reviewing your investigation...")

    print("\nEvidence investigated:")

    for clue_id in investigated_clues:

        print(
            "✓",
            clue_id,
            "-",
            case["clues"][clue_id]["text"]
        )

    print("\nSuspects interrogated:")

    for suspect in interrogated_suspects:

        print("✓", suspect)

    data = case["suspects"][selected]

    print("\n" + "-" * 65)

    # AI evaluates the selected hypothesis
    if data["access"] and data["location"] in [
        "Computer Lab",
        "Bedroom",
        "College"
    ]:

        print(
            "AI REVIEW:"
        )

        print(
            selected,
            "is strongly connected to the available evidence."
        )

        print(
            "However, the system cannot establish guilt "
            "with certainty."
        )

    elif data["location"] in [
        "Library",
        "Garden",
        "Kitchen",
        "Living Room",
        "Home",
        "Hostel",
        "Outside College"
    ]:

        print(
            "AI REVIEW:"
        )

        print(
            selected,
            "has information that may support an alibi."
        )

        print(
            "The available evidence does not strongly "
            "support this hypothesis."
        )

    else:

        print(
            "AI REVIEW:"
        )

        print(
            "The evidence is insufficient to establish "
            "a strong connection."
        )

    print("\nInvestigation completed.")


# ============================================================
# MAIN MENU
# ============================================================

def investigation_menu(case):

    global investigated_clues
    global interrogated_suspects

    investigated_clues = []
    interrogated_suspects = []

    display_case(case)

    input(
        "\nPress ENTER to begin the investigation..."
    )

    while True:

        print("\n" + "=" * 65)
        print("                 INVESTIGATION MENU")
        print("=" * 65)

        print("1. Examine Evidence")
        print("2. Interrogate Suspect")
        print("3. Search Evidence using BFS")
        print("4. Search Evidence using DFS")
        print("5. Ask AI to Analyze")
        print("6. View Current Evidence")
        print("7. Make Final Accusation")
        print("8. Restart Investigation")
        print("0. Return to Main Menu")

        choice = input(
            "\nEnter your choice: "
        )

        if choice == "1":

            examine_clue(case)

        elif choice == "2":

            interrogate(case)

        elif choice == "3":

            bfs(case)

        elif choice == "4":

            dfs(case)

        elif choice == "5":

            forward_chaining(case)
            ai_analysis(case)

        elif choice == "6":

            display_evidence(case)

        elif choice == "7":

            final_accusation(case)

        elif choice == "8":

            investigated_clues = []
            interrogated_suspects = []

            print(
                "\nInvestigation restarted."
            )

        elif choice == "0":

            break

        else:

            print("\nInvalid choice.")


# ============================================================
# MAIN PROGRAM
# ============================================================

def main():

    while True:

        header()

        print("\n1. Start New Investigation")
        print("0. Exit")

        choice = input(
            "\nEnter choice: "
        )

        if choice == "1":

            case = select_case()

            if case is not None:

                investigation_menu(case)

        elif choice == "0":

            print(
                "\nThank you for using AI Detective."
            )

            break

        else:

            print(
                "\nInvalid choice."
            )


# ============================================================
# PROGRAM START
# ============================================================

if __name__ == "__main__":

    main()