"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronUp, ChevronDown } from "lucide-react";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { FlashCardControls } from "./components/FlashCardControls";
import { FlashCardDisplay } from "./components/FlashCardDisplay";
import { PDFInput } from "./components/PDFInput";
import { usePDFProcessor } from "./hooks/usePDFProcessor";
import { useFlashCard } from "./hooks/useFlashCard";
import "./styles/flashcard.css";

export default function PDFProcessor() {
  const {
    pdfLink,
    setPdfLink,
    file,
    setFile,
    isLoading,
    cards,
    setCards,
    hashtag,
    setHashtag,
    errorMessage,
    handleProcess,
  } = usePDFProcessor();

  const handleCardEdit = (index: number, newText: string) => {
    const newCards = [...cards];
    newCards[index] = newText;
    setCards(newCards);
  };

  const {
    currentCard,
    editMode,
    setEditMode,
    cardStyle,
    textColor,
    hasSwipedUp,
    handlers,
    navigateCard,
    handleColorChange,
    handleTextColorChange,
  } = useFlashCard(cards);

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfLink(e.target.value);
  };

  const handleFileChange = (file: File | null) => {
    setFile(file);
  };

  const openSourceDocument = () => {
    if (pdfLink) {
      window.open(pdfLink, "_blank");
    } else if (file) {
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, "_blank");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (cards.length > 0) {
    return (
      <div
        className="min-h-screen w-full overflow-hidden bg-gradient-to-r from-blue-100 to-white flex flex-col items-center justify-center p-4"
      >
        <div className="w-full max-w-3xl mb-4 flex justify-between items-center relative z-20">
          <Button
            variant="link"
            onClick={() => {
              setCards([]);
              setHashtag([]);
              setPdfLink("");
              setFile(null);
            }}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="text-sm text-blue-600 mr-4">
            Card {currentCard + 1} of {cards.length}
          </div>
        </div>

        <div className="w-full max-w-3xl flex flex-col items-center">
          <FlashCardDisplay
            cardStyle={cardStyle}
            textColor={textColor}
            currentCard={currentCard}
            cards={cards}
            editMode={editMode}
            hasSwipedUp={hasSwipedUp}
            handleEdit={handleCardEdit}
            handlers={handlers}
          />
          <div className="relative z-20">
            <FlashCardControls
              editMode={editMode}
              setEditMode={setEditMode}
              handleColorChange={handleColorChange}
              handleTextColorChange={handleTextColorChange}
              openSourceDocument={openSourceDocument}
              currentCard={cards[currentCard] || ""}
            />
          </div>
        </div>

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateCard("prev")}
            disabled={currentCard === 0}
            aria-label="Previous card"
            className="border-blue-500 text-blue-500 hover:bg-blue-100"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateCard("next")}
            disabled={currentCard === cards.length - 1}
            aria-label="Next card"
            className="border-blue-500 text-blue-500 hover:bg-blue-100"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PDFInput
      pdfLink={pdfLink}
      handleLinkChange={handleLinkChange}
      handleFileChange={handleFileChange}
      handleProcess={handleProcess}
      errorMessage={errorMessage}
    />
  );
}
