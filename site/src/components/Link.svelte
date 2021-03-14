<script>
	import { Link, useLocation } from 'svelte-navigator';
	const location = useLocation();

	export let to;
	export let activeClass = '';
</script>

<Link
	{to}
	on:click
	class="{$$restProps.class} {$location.pathname === to ? activeClass : ''}"
	><slot /></Link
>
