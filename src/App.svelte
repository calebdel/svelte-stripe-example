<script>
  export let name;

  import CheckOut from "./CheckOut.svelte";
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    width: 100%;
    height: 100%;
  }

  h1 {
    color: #6ecd31;
    font-size: 4em;
    font-weight: 300;
  }

  @media (min-width: 640px) {
    /* main {
      max-width: none;
    } */
  }
</style>

<main>
  <h1>Subscribe to Mealime!!</h1>
  <CheckOut />
</main>
