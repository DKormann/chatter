
import type { message } from "./api";
import { mistral_key } from "./store";
import { get } from "svelte/store";

const url = "https://api.mistral.ai/v1/chat/completions"

export async function get_answers(hist:message[], 
  stream=false, 
  callback?: (res: string) => void){

  console.log(hist);
  

  let answer = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${get(mistral_key)}`
    },
    body: JSON.stringify({
      messages: hist,
      model: "open-mixtral-8x7b",
      stream,
    })
  })

  if (stream){
    let reader = answer.body!.getReader();
    let decoder = new TextDecoder();

    while (true) {
      let { done, value } = await reader.read();
      if (done) break;
      const data = decoder.decode(value);
      let splits = data.split("\ndata:")
      for (let s of splits){
        s = s.replace("data:", "")
        if (s.trim() == "[DONE]") break
        let res = JSON.parse(s)
        callback!(res.choices[0].delta.content)
      }
    }
    return
  }

  let res = await answer.json()
  return res.choices[0].message.content

}