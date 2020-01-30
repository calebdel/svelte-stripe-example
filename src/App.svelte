<script>
	export let name;
	import CheckOut from './CheckOut.svelte';
</script>

<main>
	<h1>Hello Stripe {name}!</h1>
	<CheckOut/>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #333;
		width:100%;
		height:100%;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>