
<script lang='ts'>
  
  import { groq_key, myaccount, liked_voices} from "./store"
  import { onMount } from "svelte";
  import { type user, type message, getAnswer} from "./api"
  import Bubble from "./bubble.svelte";
  import { tts } from "./tts";
  import { browser } from "$app/environment";
  import {get_answers} from "./mistral"

  onMount(() => {
    
    if (!$groq_key) $groq_key = prompt("Please enter your API key")!

  });
 
  let chat:HTMLDivElement;

  let active_answer:message|null = null

  function send_message(message:string, user:user = "user"){
    $myaccount = {...$myaccount, history: [...$myaccount.history, {role: user, content: message}]}

    if (user === "user"){
      active_answer = {role:'assistant', content:''} as message
      $myaccount.history.push(active_answer)
      get_answers($myaccount.history.slice(0,-1), true, chunk=>{
        active_answer!.content = active_answer!.content + chunk     
        $myaccount.history = [...$myaccount.history.slice(0,-1), active_answer!]
      })
    }

    chat.children[chat.children.length-1].scrollIntoView();
  }

  let userinput: HTMLTextAreaElement;
  
  function keydown(e:KeyboardEvent){
    if (e.key === "Enter" && e.metaKey){
      send_message(userinput.value);
      userinput.value = "";
    }
  }

  function reset(){
    $myaccount = {...$myaccount, history: [
    {
      "role":"system",
      "content": $myaccount.prompt
    },
    {
      role: "assistant",
      content: $myaccount.start_message
    }]}
    $myaccount.history= $myaccount.history
  }


  if ($myaccount.history.length == 0) {
    reset()
  }

</script>

<h1>Chat</h1>

<div id=chat bind:this={chat}>
  {#each $myaccount.history as {role, content: message}}
    <Bubble data={{role, content: message}}/>
  {/each}

</div>

<div id=input>
  <button on:click={reset}>reset</button>
  <textarea placeholder="input" rows="1" bind:this={userinput} on:keydown={keydown}/>
</div>
