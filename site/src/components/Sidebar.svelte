<script>
  import { tweened } from 'svelte/motion';
  import MenuItem from './MenuItem.svelte';
  import { crossfade, fade } from 'svelte/transition';

  export let open = true;

  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 200),

    // fallback(node, params) {
    //   console.log('🚀 ~ file: Sidebar.svelte ~ line 10 ~ fallback ~ style', style)
    //   const transform = style.transform === 'none' ? '' : style.transform;

    //   return {
    //     duration: 6000,
    //     easing: linear,
    //     css: (t) => `
    // 			transform: translateY(${t * 50});
    // 		`,
    //   };
    // },
  });
  let width = tweened(open ? 1 : 0, {
    duration: 200,
  });

  $: {
    width.set(open ? 1 : 0);
  }
</script>

<aside
  class="border-r-2 border-gray-200 p-0 h-screen pt-3"
  style="width: {$width * 250}px;"
>
  <div class="mt-10 bg-white shadow w-full my-2 overflow-hidden">
    <ul class="list-reset w-full">
      <MenuItem to="/" {send} {receive}>
        <!-- <svg slot="icon" class="mr-4" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg> -->
        Demo
      </MenuItem>
      <MenuItem to="/store" {send} {receive}>
        <!-- <svg slot="icon" class="mr-4" width="1em" height="1em"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg> -->
        Store
      </MenuItem>
      <MenuItem to="/toast-container" {send} {receive}>ToastContainer</MenuItem>
      <MenuItem to="/toast" {send} {receive}>Toast</MenuItem>
      <MenuItem to="/flat-toast" {send} {receive}>FlatToast</MenuItem>
      <MenuItem to="/bootstrap-toast" {send} {receive}>BootstrapToast</MenuItem>
      <MenuItem to="/custom-toast" {send} {receive}>Custom Toast</MenuItem>
    </ul>
  </div>
</aside>

<style lang="scss">
  aside {
    width: 0;
    min-height: 100vh;
    &.open {
      width: 250px;
    }
  }
</style>
