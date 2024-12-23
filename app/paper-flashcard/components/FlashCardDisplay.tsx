import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronUp } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { FlashCardContent } from "../types";
import { SECTIONS } from "../hooks/useFlashCard";

interface FlashCardDisplayProps {
  cardStyle: string;
  textColor: string;
  currentCard: number;
  cards: FlashCardContent[];
  editMode: boolean;
  hasSwipedUp: boolean;
  handleEdit: (index: number, newContent: FlashCardContent) => void;
  handlers: any;
}

export const FlashCardDisplay = ({
  cardStyle,
  textColor,
  currentCard,
  cards,
  editMode,
  hasSwipedUp,
  handleEdit,
  handlers,
}: FlashCardDisplayProps) => {
  const currentSection = SECTIONS[currentCard % SECTIONS.length];
  const currentCardIndex = Math.floor(currentCard / SECTIONS.length);
  const totalCards = cards.length * SECTIONS.length;

  return (
    <div className="relative w-full h-[70vh] flex items-center justify-center">
      {/* Swipe handler container */}
      <div 
        className={`absolute inset-0 z-10 touch-pan-y ${editMode ? 'pointer-events-none' : ''}`} 
        {...handlers} 
      />
      
      <div className="absolute w-full h-full flex items-center justify-center">
        <FlashCard
          cardStyle={cardStyle}
          textColor={textColor}
          content={cards[currentCardIndex]}
          section={currentSection}
          cardNumber={currentCard + 1}
          totalCards={totalCards}
          editMode={editMode}
          handleEdit={(content) => handleEdit(currentCardIndex, content)}
        />
      </div>

      {!hasSwipedUp && cards.length > 0 && (
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center text-blue-500 animate-bounce pointer-events-none z-50">
          <ChevronUp size={24} />
          <p className="text-sm">Swipe Up</p>
        </div>
      )}
    </div>
  );
};

interface FlashCardProps {
  cardStyle: string;
  textColor: string;
  content: FlashCardContent;
  section: typeof SECTIONS[number];
  cardNumber: number;
  totalCards: number;
  editMode: boolean;
  handleEdit: (content: FlashCardContent) => void;
}

const FlashCard = ({
  cardStyle,
  textColor,
  content,
  section,
  cardNumber,
  totalCards,
  editMode,
  handleEdit,
}: FlashCardProps) => {
  const [editedContent, setEditedContent] = useState<FlashCardContent>(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleSave = () => {
    handleEdit(editedContent);
  };

  return (
    <Card
      className={`w-full h-full shadow-xl border border-blue-200 flex flex-col p-8 sm:p-12 relative ${cardStyle}`}
    >
      <div className="absolute top-4 left-4 bg-blue-200 text-blue-600 text-xs font-semibold rounded-full px-2 py-1 z-20">
        #{section.key}
      </div>
      <div className="text-xl sm:text-3xl font-bold w-full h-full mt-10 flex flex-col overflow-hidden">
        {editMode ? (
          <div className="relative w-full h-full z-20">
            <Textarea
              value={editedContent[section.key]}
              onChange={(e) => {
                const newContent = { ...editedContent };
                newContent[section.key] = e.target.value;
                setEditedContent(newContent);
              }}
              onBlur={handleSave}
              className={`w-full h-full resize-none bg-transparent border-none focus-visible:ring-0 text-xl sm:text-3xl font-bold leading-relaxed ${textColor}`}
              placeholder={`Enter ${section.label.toLowerCase()} here...`}
              autoFocus
            />
          </div>
        ) : (
          <div 
            className={`overflow-y-auto h-full whitespace-pre-wrap ${textColor} pr-4 z-20 relative`}
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#93C5FD transparent'
            }}
          >
            {content[section.key]}
          </div>
        )}
      </div>
    </Card>
  );
};
