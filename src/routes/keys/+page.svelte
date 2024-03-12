
<script lang='ts'>

  import { groq_key, mistral_key} from "../store"

</script>

<h2>keys</h2>

<table>


    <tr>
      <td> groq key </td>
      <td> <input bind:value={$groq_key} type="password"> </td>
    </tr> 
    <tr>
      <td> mistral key </td>  
      <td> <input bind:value={$mistral_key} type="password"> </td>
    </tr>

</table>
