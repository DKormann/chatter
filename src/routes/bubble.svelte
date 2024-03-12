<script lang='ts'>
  import type {message} from "./api"

  export var data: message

  let blocks = [{type: "text", lines: [] as string[]}]
  
  $: update(data)
  
  function update(data:message){

    let lines = data.content.split("\n")
    blocks = [{type: "text", lines: [] as string[]}]

    for (let line of lines){
      if (line.startsWith("```")){
        blocks.push({type: (blocks.length>0 && blocks[blocks.length-1].type == "text") ? (line.replace("```","") == "" ? "code" : line.replace("```","")) : "text", lines:[]})
        continue
      }
      blocks[blocks.length-1].lines.push(line)
    }
  }

  
</script>

<div class={"bubble "+data.role}>
  {#each blocks as block}
    <div class={block.type=="text" ? "text" : "code"}>{#if block.type != 'text'}<div class=codehead>{block.type}</div>{/if}{block.lines.join("\n")}
    </div>
  {/each}
</div>


