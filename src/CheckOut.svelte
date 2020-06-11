<script>
  import { onMount } from "svelte";

  var stripe = Stripe("pk_live_m4VIY9Wed7VnX69kkQBdYPQW");
  var elements = stripe.elements();

  var style = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  let cardElement;

  let rewardfulReady = false;
  let mounted = false;

  // function stripeLoaded() {
  //     // The external Stripe javascript is ready.
  //     rewardfulReady = true;
  //     if (mounted) {
  //         loadStripeElements();
  //     }
  // }

  function loadRewardful() {
    // Time for Stripe.js to do its magic.
    const rwdful = Rewardful;
    console.log(rwdful);
    // etc..
  }

  // const initializeRewardful = () => {
  //   window.addEventListener("Rewardful.tracked", () => {
  //     console.log("Rewardful has finished loading");
  //     console.log("rewardful", Rewardful);
  //     console.log(Rewardful.referral);
  //     console.log(Rewardful.coupon);

  //     // `Rewardful.referral` and `Rewardful.affiliate` are now available.
  //   });
  // };

  function rewardfulLoaded() {
    // The external Stripe javascript is ready.
    rewardfulReady = true;
    if (mounted) {
      loadRewardful();
    }
  }

  onMount(async () => {
    mounted = true;
    if (rewardfulReady) {
      loadRewardful();
    }

    cardElement = elements.create("card", { style: style });
    cardElement.mount("#card-element");
  });

  async function createPayment() {
    const payMethod = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        email: "mealime@example.com"
      }
    });

    console.log("referral", Rewardful.referral);
    console.log("coupon", Rewardful.coupon);

    const response = await fetch("/.netlify/functions/stripe-charge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        email: "jenny.rosen@example.com",
        payment_method: payMethod.paymentMethod.id,
        referral: Rewardful.referral.toString(),
        coupon: Rewardful.coupon
      })
    }).then(function(response) {
      if (!response.ok) {
        return response
          .text()
          .then(result => Promise.reject(new Error(result)));
      }

      return response.json();
    });

    return await response.json();
  }
</script>

<style>
  .MyCardElement {
    height: 40px;
    padding: 17px 12px 0px;
    width: 50%;
    color: #32325d;
    background-color: white;
    border: 1px solid transparent;
    border-radius: 4px;

    box-shadow: 0 1px 3px 0 #e6ebf1;
    -webkit-transition: box-shadow 150ms ease;
    transition: box-shadow 150ms ease;
  }

  button {
    border-radius: 4px;
    box-shadow: 0 1px 3px 0 #e6ebf1;
    border: 1px solid transparent;
    padding: 6px 10px;
    margin-top: 1.2em;
  }

  .MyCardElement--focus {
    box-shadow: 0 1px 3px 0 #cfd7df;
  }

  .MyCardElement--invalid {
    border-color: #fa755a;
  }

  .MyCardElement--webkit-autofill {
    background-color: #fefde5 !important;
  }
</style>

<svelte:head>
  <script
    data-rewardful="2ad021"
    src="https://r.wdfl.co/rw.js"
    on:load={console.log('looooooaded')}>

  </script>
</svelte:head>
<div id="card-element" class="MyCardElement">
  <!-- Elements will create input elements here -->
</div>

<!-- We'll put the error messages in this element -->
<div id="card-errors" role="alert" />

<button on:click={createPayment} id="submit">Pay</button>
