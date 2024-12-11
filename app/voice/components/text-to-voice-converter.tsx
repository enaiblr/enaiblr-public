"use client";

import { useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { LoadingState } from "./loading-state";
import { ResultView } from "./result-view";
import { InputForm } from "./input-form";

export default function TextToVoiceConverter() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [language, setLanguage] = useState("");
  const [voice, setVoice] = useState("");
  const [audioData, setAudioData] = useState<{
    url: string;
    duration: number;
    size: number;
  } | null>(null);

  const synthesizeSpeech = async () => {
    // Initialize speech config with your Azure credentials
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_SPEECH_KEY!,
      process.env.NEXT_PUBLIC_SPEECH_REGION!
    );

    // Set the voice based on selected language and voice
    speechConfig.speechSynthesisVoiceName = `${voice}`;

    // Create the synthesizer
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    return new Promise<ArrayBuffer>((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            // Convert the audio data to ArrayBuffer
            const audioData = result.audioData;
            synthesizer.close();
            resolve(audioData);
          } else {
            synthesizer.close();
            reject(new Error(`Speech synthesis canceled: ${result.errorDetails}`));
          }
        },
        (error) => {
          synthesizer.close();
          reject(error);
        }
      );
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const audioBuffer = await synthesizeSpeech();

      // Create blob and URL
      const blob = new Blob([audioBuffer], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);

      // Calculate size in MB
      const size = blob.size / (1024 * 1024);

      // Set audio data (duration would need to be calculated from the actual audio)
      setAudioData({
        url,
        duration: 0, // This would need to be calculated from the actual audio
        size,
      });

      setIsComplete(true);
    } catch (error) {
      console.error("Error synthesizing speech:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isComplete && audioData) {
    return (
      <ResultView
        text={text}
        audioUrl={audioData.url}
        size={audioData.size}
        onReset={() => {
          setIsComplete(false);
          setAudioData(null);
          setText("");
          setLanguage("");
          setVoice("");
        }}
      />
    );
  }

  return (
    <InputForm
      text={text}
      language={language}
      voice={voice}
      onTextChange={setText}
      onLanguageChange={setLanguage}
      onVoiceChange={setVoice}
      onSubmit={handleSubmit}
    />
  );
}