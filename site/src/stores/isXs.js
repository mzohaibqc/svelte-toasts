import { writable } from 'svelte/store';

export default writable(!window.matchMedia('(min-width: 640px)').matches);
