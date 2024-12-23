import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronUp } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { FlashCardContent } from "../types";
import { SECTIONS } from "../hooks/useFlashCard";
import { TransitionGroup, CSSTransition } from "react-transition-group";

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
  const nodeRef = useRef(null);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const prevCardRef = useRef(currentCard);

  useEffect(() => {
    const newDirection = currentCard > prevCardRef.current ? 'up' : 'down';
    setDirection(newDirection);
    prevCardRef.current = currentCard;
  }, [currentCard]);

  return (
    <div className="relative w-full h-[70vh]">
      {/* Card container */}
      <div className="absolute inset-0 overflow-hidden">
        <TransitionGroup>
          <CSSTransition
            key={currentCard}
            timeout={300}
            classNames={{
              enter: direction === 'up' ? 'slide-up-enter' : 'slide-down-enter',
              enterActive: direction === 'up' ? 'slide-up-enter-active' : 'slide-down-enter-active',
              exit: direction === 'up' ? 'slide-up-exit' : 'slide-down-exit',
              exitActive: direction === 'up' ? 'slide-up-exit-active' : 'slide-down-exit-active'
            }}
            nodeRef={nodeRef}
          >
            <div ref={nodeRef} className="absolute inset-0">
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
          </CSSTransition>
        </TransitionGroup>

        {/* Swipe handler */}
        <div 
          className={`absolute inset-0 ${editMode ? 'pointer-events-none' : ''}`} 
          {...handlers} 
        />

        {!hasSwipedUp && cards.length > 0 && (
          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center text-blue-500 animate-bounce pointer-events-none">
            <ChevronUp size={24} />
            <p className="text-sm">Swipe Up</p>
          </div>
        )}
      </div>
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
  const contentLength = content[section.key].length;

  // Calculate text size based on content length
  const getTextSize = () => {
    if (contentLength < 100) return 'text-2xl sm:text-3xl';
    if (contentLength < 200) return 'text-xl sm:text-2xl';
    if (contentLength < 400) return 'text-lg sm:text-xl';
    if (contentLength < 600) return 'text-base sm:text-lg';
    return 'text-sm sm:text-base';
  };

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleSave = () => {
    handleEdit(editedContent);
  };

  const textSize = getTextSize();

  return (
    <Card
      className={`w-full h-full shadow-xl border border-blue-200 flex flex-col p-8 sm:p-12 relative ${cardStyle}`}
    >
      <div className="absolute top-4 left-4 bg-blue-200 text-blue-600 text-xs font-semibold rounded-full px-2 py-1">
        #{section.key}
      </div>
      <div className={`font-bold w-full h-full mt-10 ${textSize}`}>
        {editMode ? (
          <Textarea
            value={editedContent[section.key]}
            onChange={(e) => {
              const newContent = { ...editedContent };
              newContent[section.key] = e.target.value;
              setEditedContent(newContent);
            }}
            onBlur={handleSave}
            className={`w-full h-full resize-none bg-transparent border-none focus-visible:ring-0 font-bold leading-relaxed ${textColor} ${textSize}`}
            placeholder={`Enter ${section.label.toLowerCase()} here...`}
            autoFocus
          />
        ) : (
          <div className={`whitespace-pre-wrap ${textColor}`}>
            {content[section.key]}
          </div>
        )}
      </div>
    </Card>
  );
};
