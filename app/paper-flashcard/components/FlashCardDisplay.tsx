import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronUp } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface FlashCardDisplayProps {
  cardStyle: string;
  textColor: string;
  currentCard: number;
  cards: string[];
  editMode: boolean;
  hasSwipedUp: boolean;
  handleEdit: (index: number, newText: string) => void;
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
  return (
    <div className="relative w-full h-[70vh]">
      {/* Swipe handler container */}
      <div 
        className={`absolute inset-0 z-10 ${editMode ? 'pointer-events-none' : ''}`} 
        {...handlers} 
      />
      
      <div 
        className={`absolute w-full h-full transition-transform duration-300 ${
          currentCard > 0 ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <FlashCard
          cardStyle={cardStyle}
          textColor={textColor}
          content={cards[0] || ''}
          cardNumber={1}
          totalCards={cards.length}
          editMode={editMode}
          handleEdit={(text) => handleEdit(0, text)}
        />
      </div>

      {cards.map((content, index) => (
        index > 0 && (
          <div
            key={index}
            className={`absolute w-full h-full transition-transform duration-300 ${
              index === currentCard
                ? 'translate-y-0 opacity-100'
                : index < currentCard
                ? '-translate-y-full opacity-0'
                : 'translate-y-full opacity-0'
            }`}
          >
            <FlashCard
              cardStyle={cardStyle}
              textColor={textColor}
              content={content}
              cardNumber={index + 1}
              totalCards={cards.length}
              editMode={editMode}
              handleEdit={(text) => handleEdit(index, text)}
            />
          </div>
        )
      ))}

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
  content: string;
  cardNumber: number;
  totalCards: number;
  editMode: boolean;
  handleEdit: (text: string) => void;
}

const FlashCard = ({
  cardStyle,
  textColor,
  content,
  cardNumber,
  totalCards,
  editMode,
  handleEdit,
}: FlashCardProps) => {
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleSave = () => {
    handleEdit(editedContent);
  };

  return (
    <Card
      className={`w-full h-full shadow-xl border border-blue-200 flex flex-col p-8 sm:p-12 relative ${cardStyle} overflow-hidden`}
      style={{}}
    >
      <div className="absolute top-4 left-4 bg-blue-200 text-blue-600 text-xs font-semibold rounded-full px-2 py-1">
        #{content.split(' ').slice(0, 1).join('').replace(/[^a-zA-Z0-9]/g, '')}
      </div>
      <div className="text-xl sm:text-3xl font-bold w-full h-full mt-10 flex flex-col">
        {editMode ? (
          <div className="relative w-full h-full z-20">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onBlur={handleSave}
              className={`w-full h-full resize-none bg-transparent border-none focus-visible:ring-0 text-xl sm:text-3xl font-bold leading-relaxed ${textColor}`}
              placeholder="Enter your text here..."
              autoFocus
            />
          </div>
        ) : (
          <div className={`overflow-auto h-full whitespace-pre-wrap ${textColor}`}>
            {content}
          </div>
        )}
      </div>
    </Card>
  );
};
