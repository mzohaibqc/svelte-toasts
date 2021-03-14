<script>
  import { onMount } from 'svelte';

  let button;
  export let autoFocus = false;

  onMount(() => {
    if (autoFocus) {
      setTimeout(() => {
        button.focus();
      }, 100);
    }
  })
</script>

<button class="ring ring-blue-600 focus:ring-offset-1 ring-offset-blue-100 h-8 px-4 bg-blue-600 focus:bg-blue-600 border-0 focus:outline-none text-white {$$restProps.class}" bind:this={button} on:click><slot /></button>