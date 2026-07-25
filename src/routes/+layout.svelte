<script lang="ts">
	import '../app.css';
	import SmallScreenGate from '$lib/components/SmallScreenGate.svelte';

	let { children } = $props();
</script>

<SmallScreenGate>
	{@render children()}
</SmallScreenGate>
