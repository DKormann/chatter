
import { groq_key } from "./store";
import { get } from "svelte/store";
import Groq from "groq-sdk";

export type user = "user" | "assistant" | "system";

export type message = {
  role: user;
  content: string;
}

const groq = new Groq({
    apiKey: get(groq_key),
    dangerouslyAllowBrowser: true
})


export async function getAnswer(messages: message[]){

    console.log(messages);
    
    const completion = await groq.chat.completions.create({
        messages:messages as any,
        model: "mixtral-8x7b-32768"
    });
    return completion.choices[0]?.message?.content || "no answer";
}



