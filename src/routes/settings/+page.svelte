
<script lang='ts'>
    import { get } from "svelte/store";
  import type {message} from "../api"
  import {type account, accounts, active_account} from "../store"

  let account_name = $accounts[$active_account].name
  let sysprompt = $accounts[$active_account].prompt
  let start_message = $accounts[$active_account].start_message

  const default_prompt = "Your are Assistant the helpful AI"
  const default_start = "Hello, I am Assistant. How can I help you today?"

  function switch_acc(id:number){
    if (id == -1){
      accounts.set([...get(accounts), {name: "new account", prompt: default_prompt, start_message:default_start, history: []}])
      console.log(get(accounts));
      
      id = $accounts.length-1
      console.log($active_account);
    }
    $active_account = id
    account_name = $accounts[$active_account].name
    sysprompt = $accounts[$active_account].prompt
    start_message = $accounts[$active_account].start_message
  }
  let picked_acc = get(active_account)
  $: switch_acc(picked_acc)
  $: edit_acc(account_name, sysprompt, start_message)

  function edit_acc(new_name:string, sysprompt:string, start_message:string){
    $accounts = $accounts.map((acc, i) => i == $active_account ? {name: new_name, prompt:sysprompt, start_message, history:acc.history} : acc)
  }

  function delete_account(){
    if (!window.confirm(`Are you sure you want to delete ${$accounts[$active_account].name}?`)){
      return
    }
    accounts.set($accounts.filter((acc, i) => i != $active_account))
    $active_account = 0
  }

</script>

<h2> <a href="/">Chat</a> settings</h2>

<div id=chat>
  <table>
    <tr>
      <td>
        <span>Account:</span>
      </td>
      <td>
        <select bind:value={picked_acc}>
          {#each $accounts as account, i}
            <option value={i} selected={i==$active_account}> {account.name} </option>
          {/each}
          <option value=-1>create new</option>
        </select>
      </td>
    </tr>
    <tr>
      <td>
        <span>change name:</span>
      </td><td>
        <input type="text" bind:value={account_name}>
      </td>
    </tr>
    <tr>
      <td>
        <label for="prompt">prompt:</label>
      </td>
      <td>
        <textarea name=prompt bind:value={sysprompt} id="" cols="30" rows="10"></textarea>
      </td>
    </tr>
    <tr>
      <td>
        <label for="start_message">start message:</label>
      </td>
      <td>
        <textarea name="start_message" id="" cols="30" rows="10" bind:value={start_message}></textarea>
      </td>
    </tr>
  </table>  
  <p></p>
  <button class=delete on:click={delete_account}>delete Account</button>
  <p></p>
</div>
