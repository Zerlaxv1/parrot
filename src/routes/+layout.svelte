<script>
	import { onMount } from "svelte";
	import { initializeYtDlp } from "$lib/yt-dlp";
	let { children } = $props();
	import "../app.css";

	onMount(() => {
		void initializeYtDlp();
	});
</script>

{@render children()}
