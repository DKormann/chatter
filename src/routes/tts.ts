
export function tts(text:string, voice:string = "Samantha"){

  if (voice == 'user'){
    voice = "Daniel"
  }else if (voice == 'assistant'){
    voice = "Karen"
  }else if (voice == 'system'){
    return
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  utterance.voice = voices.find((v) => v.name == voice) || voices[0];
  utterance.lang = "en-US";
  utterance.volume= 0.5
  window.speechSynthesis.speak(utterance);

}
