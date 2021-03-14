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
  <!-- <div class="flex items-center">
    <svg class="text-5xl mx-4" height="1em" fill="#e63e08" width="1em" viewBox="0 -7 387.30393 387" xmlns="http://www.w3.org/2000/svg">
      <path in:draw="{{duration: 3000}}" d="m287.878906 373.824219h-234.425781c-29.472656 0-53.453125-23.980469-53.453125-53.453125v-234.425782c0-29.476562 23.980469-53.453124 53.453125-53.453124h223.464844c3.769531 0 6.824219 3.050781 6.824219 6.824218 0 3.773438-3.054688 6.828125-6.824219 6.828125h-223.464844c-21.945313 0-39.800781 17.851563-39.800781 39.800781v234.425782c0 21.945312 17.855468 39.796875 39.800781 39.796875h234.425781c21.945313 0 39.800782-17.851563 39.800782-39.796875v-206.117188c0-3.773437 3.054687-6.824218 6.824218-6.824218 3.769532 0 6.828125 3.050781 6.828125 6.824218v206.117188c0 29.472656-23.980469 53.453125-53.453125 53.453125zm0 0"/><path d="m327.628906 119.421875c-15.1875 0-29.578125-5.671875-40.710937-16.105469-11.625-10.886718-18.3125-25.652344-18.832031-41.574218-1.074219-32.859376 24.78125-60.464844 57.644531-61.539063 15.828125-.660156 31.089843 5.179687 42.710937 16.074219 11.625 10.886718 18.3125 25.652344 18.832032 41.570312 1.070312 32.859375-24.785157 60.46875-57.644532 61.542969-.664062.027344-1.332031.03125-2 .03125zm.085938-105.597656c-.511719 0-1.023438.007812-1.539063.019531-25.335937.832031-45.273437 22.121094-44.441406 47.460938.398437 12.273437 5.554687 23.652343 14.515625 32.046874 8.964844 8.398438 20.675781 12.6875 32.933594 12.398438 25.335937-.832031 45.273437-22.117188 44.441406-47.460938-.398438-12.269531-5.554688-23.652343-14.515625-32.042968-8.585937-8.046875-19.683594-12.421875-31.394531-12.421875zm0 0"/><path d="m65.265625 178.847656c-4-3.996094-10.484375-3.996094-14.480469 0-4 4-4 10.484375 0 14.480469 3.996094 4 10.480469 4 14.480469 0 4-3.996094 4-10.480469 0-14.480469zm0 0"/><path d="m283.714844 178.851562c-3.996094-4-10.480469-4-14.480469 0-3.996094 3.996094-3.996094 10.480469 0 14.480469 4 4 10.484375 4 14.480469 0 4-4 4-10.484375 0-14.480469zm0 0"/><path d="m218.453125 218.015625c-.105469-10.710937-95.464844-10.710937-95.570313 0v.230469c0 18.058594 21.394532 32.699218 47.785157 32.699218s47.785156-14.640624 47.785156-32.699218c0-.078125 0-.152344 0-.230469zm-48.9375 19.273437c-11.3125 0-20.480469-3.054687-20.480469-6.824218 0-3.769532 9.167969-6.828125 20.480469-6.828125 11.308594 0 20.480469 3.058593 20.480469 6.828125 0 3.769531-9.167969 6.824218-20.480469 6.824218zm0 0"/></svg>
    <Link to="/">
      <h1 class="text-2xl block text-left text-center">Svelte Toasts</h1>
    </Link>
  </div> -->
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
