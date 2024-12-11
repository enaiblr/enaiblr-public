"use client";

import { useState } from "react";
import { LoadingState } from "./loading-state";
import { ResultView } from "./result-view";
import { InputForm } from "./input-form";

export default function TextToVoiceConverter() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [language, setLanguage] = useState("en-US");

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsComplete(true);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isComplete) {
    return <ResultView text={text} onReset={() => setIsComplete(false)} />;
  }

  return (
    <InputForm
      text={text}
      language={language}
      onTextChange={setText}
      onLanguageChange={setLanguage}
      onSubmit={handleSubmit}
    />
  );
}