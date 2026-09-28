import React, { useState } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import CaseSelection from "./components/CaseSelection";
import InvestigationDashboard from "./components/InvestigationDashboard";
import HowItWorksModal from "./components/HowItWorksModal";
import BackgroundCanvas from "./components/BackgroundCanvas";
import { CASES } from "./data/cases";

export default function App() {
  const [currentView, setCurrentView] = useState("home"); // "home" | "cases" | "investigation"
  const [activeCaseId, setActiveCaseId] = useState(1);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Investigated clues list mapped by case ID: { [caseId]: string[] }
  const [investigatedCluesMap, setInvestigatedCluesMap] = useState({
    1: [],
    2: [],
    3: [],
  });

  // Interrogated suspects list mapped by case ID: { [caseId]: string[] }
  const [interrogatedSuspectsMap, setInterrogatedSuspectsMap] = useState({
    1: [],
    2: [],
    3: [],
  });

  // Questions answered mapped by: { [caseId]: { [suspectName]: Set<string> } }
  const [answeredQuestionsMap, setAnsweredQuestionsMap] = useState({
    1: {},
    2: {},
    3: {},
  });

  const activeCase = CASES.find((c) => c.id === activeCaseId) || CASES[0];

  const currentInvestigatedClues = investigatedCluesMap[activeCaseId] || [];
  const currentInterrogatedSuspects = interrogatedSuspectsMap[activeCaseId] || [];
  const currentAnsweredQuestions = answeredQuestionsMap[activeCaseId] || {};

  // Handlers
  const handleSelectCase = (caseObj) => {
    setActiveCaseId(caseObj.id);
    setCurrentView("investigation");
  };

  const handleExamineClue = (clueId) => {
    setInvestigatedCluesMap((prev) => {
      const currentList = prev[activeCaseId] || [];
      if (!currentList.includes(clueId)) {
        return {
          ...prev,
          [activeCaseId]: [...currentList, clueId],
        };
      }
      return prev;
    });
  };

  const handleRecordInterrogation = (suspectName, questionId) => {
    // Mark suspect as interrogated
    setInterrogatedSuspectsMap((prev) => {
      const currentList = prev[activeCaseId] || [];
      if (!currentList.includes(suspectName)) {
        return {
          ...prev,
          [activeCaseId]: [...currentList, suspectName],
        };
      }
      return prev;
    });

    // Record question answered
    setAnsweredQuestionsMap((prev) => {
      const caseQuestions = { ...(prev[activeCaseId] || {}) };
      const suspectSet = new Set(caseQuestions[suspectName] || []);
      suspectSet.add(questionId);
      caseQuestions[suspectName] = suspectSet;

      return {
        ...prev,
        [activeCaseId]: caseQuestions,
      };
    });
  };

  // 15. Restart Investigation (Resets clues, suspects, questions)
  const handleRestartCase = () => {
    setInvestigatedCluesMap((prev) => ({
      ...prev,
      [activeCaseId]: [],
    }));
    setInterrogatedSuspectsMap((prev) => ({
      ...prev,
      [activeCaseId]: [],
    }));
    setAnsweredQuestionsMap((prev) => ({
      ...prev,
      [activeCaseId]: {},
    }));
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-[#e2e8f0] font-sans selection:bg-red-500/25 selection:text-red-200">
      {/* Subtle Interactive Grid & Node Background */}
      <BackgroundCanvas />

      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        activeCase={activeCase}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Main View Router */}
      <main className="relative z-10 w-full">
        {currentView === "home" && (
          <LandingPage
            onStart={() => setCurrentView("cases")}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          />
        )}

        {currentView === "cases" && (
          <CaseSelection
            cases={CASES}
            onSelectCase={handleSelectCase}
            activeCaseId={activeCaseId}
          />
        )}

        {currentView === "investigation" && (
          <InvestigationDashboard
            caseData={activeCase}
            investigatedClues={currentInvestigatedClues}
            interrogatedSuspects={currentInterrogatedSuspects}
            answeredQuestionsMap={currentAnsweredQuestions}
            onExamineClue={handleExamineClue}
            onRecordInterrogation={handleRecordInterrogation}
            onRestartCase={handleRestartCase}
            onChangeCase={() => setCurrentView("cases")}
          />
        )}
      </main>

      {/* Academic Viva & How It Works Modal */}
      {isHowItWorksOpen && (
        <HowItWorksModal onClose={() => setIsHowItWorksOpen(false)} />
      )}
    </div>
  );
}
