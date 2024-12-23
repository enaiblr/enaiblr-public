import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { TEXT_COLORS, GRADIENTS } from '../constants';

export const useFlashCard = (cards: string[]) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [cardStyle, setCardStyle] = useState("bg-gradient-to-r from-blue-100 to-white");
  const [textColor, setTextColor] = useState(TEXT_COLORS[0]);
  const [hasSwipedUp, setHasSwipedUp] = useState(false);

  // Reset current card when cards array changes
  useEffect(() => {
    setCurrentCard(0);
    setHasSwipedUp(false);
  }, [cards]);

  const safeSetCurrentCard = (newIndex: number) => {
    if (cards.length === 0) return;
    const safeIndex = Math.max(0, Math.min(newIndex, cards.length - 1));
    setCurrentCard(safeIndex);
  };

  const handlers = useSwipeable({
    onSwipedUp: () => {
      if (currentCard < cards.length - 1) {
        safeSetCurrentCard(currentCard + 1);
        setHasSwipedUp(true);
      }
    },
    onSwipedDown: () => {
      if (currentCard > 0) {
        safeSetCurrentCard(currentCard - 1);
      }
    },
  });

  const navigateCard = (direction: "next" | "prev") => {
    if (direction === "next" && currentCard < cards.length - 1) {
      safeSetCurrentCard(currentCard + 1);
      setHasSwipedUp(true);
    } else if (direction === "prev" && currentCard > 0) {
      safeSetCurrentCard(currentCard - 1);
    }
  };

  const handleColorChange = (gradient: string) => {
    setCardStyle(gradient);
    // Update text color based on gradient index
    const gradientIndex = GRADIENTS.indexOf(gradient);
    if (gradientIndex !== -1) {
      setTextColor(TEXT_COLORS[gradientIndex]);
    }
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
  };

  return {
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
  };
};
