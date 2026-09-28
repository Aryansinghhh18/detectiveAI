# 🕵️ AI DETECTIVE — Interactive AI Investigation System

An interactive, browser-based conversion of the Python **AI Detective** console project (`Aidetective.py`).

Demonstrates 6 core AI concepts in an atmospheric, modern detective dashboard:
1. **Knowledge Representation**
2. **BFS (Breadth-First Search)**
3. **DFS (Depth-First Search)**
4. **Forward Chaining**
5. **Rule-Based Reasoning**
6. **State-Space Search**

---

## ⚡ Quick Start

### Option 1: 1-Click Launch (Windows)
Double-click **`start.bat`** in the project folder. It will launch the local development server and open `http://localhost:5173` automatically in your browser.

### Option 2: Terminal / PowerShell
```bash
# 1. Run local dev server
npm run dev

# 2. Open browser at http://localhost:5173
```

### Option 3: Production Build
```bash
npm run build
npm run preview
```

---

## 🎯 Python Logic & Data Preserved Exactly

The website faithfully implements every case, suspect, clue, link, and rule from `Aidetective.py`:

### The 3 Playable Cases:
1. **Case 1: The Missing Laptop**
   * *Location:* Computer Laboratory (2:00 PM – 3:00 PM)
   * *Suspects:* Rahul (Library), Riya (Outside College), Karan (Near Computer Lab), Arjun (Computer Lab)
   * *Clues:* C1 (Incident window) ➔ C2 (Rahul in library), C3 (Riya left college), C4 (Karan near lab) ➔ C5 (CCTV entry) ➔ C6 (Arjun's access card used)
2. **Case 2: The Missing Necklace**
   * *Location:* Bedroom (Family gathering)
   * *Suspects:* Aman (Garden), Neha (Kitchen), Vikram (Bedroom), Sneha (Living Room)
   * *Clues:* C1 (Last seen in bedroom) ➔ C2 (Vikram seen near bedroom) ➔ C3 (Vikram has access) ➔ C4 (Bedroom door opened)
3. **Case 3: Unauthorized Lab Access**
   * *Location:* Restricted College Lab (11:45 PM)
   * *Suspects:* Dev (Home), Meera (Hostel), Rohan (College), Priya (Library)
   * *Clues:* C1 (Access at 11:45 PM) ➔ C2 (CCTV entry) & C3 (Rohan on campus) ➔ C4 (Rohan has valid card) ➔ C5 (Rohan's card recorded)

---

## 🧠 Core AI Modules Implemented

### 1. BFS Evidence Search (Breadth-First Search)
* Uses a **FIFO Queue** starting from root clue `C1`.
* Traverses the evidence graph level-by-level:
  $$\text{Queue: } [C_1] \implies \text{Dequeue } C_1 \implies \text{Enqueue neighbours } [C_2, C_3, C_4] \dots$$
* Explores all shallow clues before proceeding deeper. Guarantees finding the shortest path of clues.

### 2. DFS Evidence Search (Depth-First Search)
* Uses a **LIFO Stack** starting from `C1`.
* Reverses neighbor insertion (`reversed(neighbours)`) matching Python logic:
  $$\text{Stack: } [C_1] \implies \text{Pop } C_1 \implies \text{Push } [C_4, C_3, C_2] \dots$$
* Deep-dives along an isolated evidence trail before backtracking.

### 3. Forward Chaining (Rule-Based Reasoning)
Data-driven inference applying production rules across all suspects:
* **RULE 1 (Alibi):** If location $\in$ `{Library, Garden, Kitchen, Living Room, Home, Hostel, Outside College}`:
  $$\implies \text{"[Suspect] has location information that may support an alibi."}$$
* **RULE 2 (Access):** If `suspect.access == True`:
  $$\implies \text{"[Suspect] has access to the relevant location."}$$
* **RULE 3 (Motive):** If `suspect.motive == True`:
  $$\implies \text{"[Suspect] has a possible motive."}$$
* **RULE 4 (Location):** If location $\in$ `{Computer Lab, Near Computer Lab, Bedroom, College}`:
  $$\implies \text{"[Suspect] was at or near the relevant location."}$$

### 4. Suspect Interrogation & AI Observation
Four standardized queries per suspect:
1. *Where were you during the incident?*
2. *Did you enter the relevant location?*
3. *Do you have access to the location?*
4. *Do you know anything about the incident?*

**AI Observation Logic:**
* If Q2 and `access == True`: $\implies$ `"Access information should be checked."`
* If Q1: $\implies$ `"The claimed location can be compared with evidence."`
* Otherwise: $\implies$ `"Statement added to investigation."`

### 5. Final Accusation Hypothesis Evaluation
* If `access == True` and target location match:
  $$\implies \text{"[Suspect] is strongly connected to the available evidence. However, the system cannot establish guilt with certainty."}$$
* If location supports an alibi:
  $$\implies \text{"[Suspect] has information that may support an alibi. The available evidence does not strongly support this hypothesis."}$$
* Otherwise:
  $$\implies \text{"The evidence is insufficient to establish a strong connection."}$$

*(Ensures evidence-based reasoning rather than absolute guilt determination)*

---

## 🗺️ How the AI Works Pipeline

```
CASE DATA ➔ KNOWLEDGE REPRESENTATION ➔ EVIDENCE GRAPH ➔ BFS / DFS SEARCH ➔ FORWARD CHAINING ➔ RULE-BASED REASONING ➔ CURRENT AI ANALYSIS ➔ USER ACCUSATION
```

---

## 📁 Project Structure

```
codes/
├── dist/                      # Static production bundle
├── src/
│   ├── components/
│   │   ├── BackgroundCanvas.jsx        # Subtle interactive node canvas
│   │   ├── CaseSelection.jsx           # Available cases dossier selector
│   │   ├── HowItWorksModal.jsx         # Academic viva & theory guide
│   │   ├── InterrogationModal.jsx      # Classified interrogation room dialog
│   │   ├── InvestigationDashboard.jsx  # Evidence board, BFS, DFS, AI engine, suspects, accusation
│   │   ├── LandingPage.jsx             # Hero, AI Concepts cards, pipeline
│   │   └── Navbar.jsx                  # Top navigation & system status
│   ├── data/
│   │   └── cases.js                    # Exact Python case database & questions
│   ├── utils/
│   │   ├── aiEngine.js                 # Pure BFS, DFS, forward chaining, observations
│   │   └── audio.js                    # Web Audio API sound synthesizer
│   ├── App.jsx                         # Main investigation state router & reset handler
│   ├── index.css                       # Dark detective theme & Tailwind CSS v4
│   └── main.jsx                        # React entrypoint
├── index.html                          # HTML5 template & Google Fonts
├── start.bat                           # 1-click Windows launcher
└── vite.config.js                      # Vite & Tailwind configuration
```
