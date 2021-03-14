<script>
	import Link from './Link.svelte';
	import { useLocation, useNavigate } from 'svelte-navigator';

	const location = useLocation();
	const navigate = useNavigate();
	export let send;
	export let receive;
	export let to;
</script>

<li
	on:click={() => navigate(to)}
	class="relative block p-4 text-grey-darker font-semibold border-gray-700 hover:border-r-4 hover:border-gray-700 hover:bg-gray-100 shadow-sm cursor-pointer {$location.pathname ===
	to
		? 'bg-gray-100'
		: ''}"
>
	<Link class="link" {to}>
		<slot name="icon" />
		<slot />
	</Link>
	{#if $location.pathname === to}
		<div
			in:receive={{ key: 'selection' }}
			out:send={{ key: 'selection' }}
			class="absolute w-1 h-full right-0 top-0 bg-gray-500"
		/>
	{/if}
</li>

<style lang="scss">
	li :global(.link) {
		display: flex;
		align-items: center;
	}
</style>
