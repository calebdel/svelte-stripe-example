<script>
  import { onMount } from 'svelte';

  var stripe = Stripe('pk_test_VWv39DvghCJYi3z1LOpdRtte00OxSyiu8j');
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

onMount(async() => {
  cardElement = elements.create("card", { style: style });
  cardElement.mount("#card-element");
})

async function createPayment(){

  const payMethod = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: {
      email: 'jenny.rosen@example.com',
    },
  }); 

  const response = await fetch(
    '/.netlify/functions/stripe-charge', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'jenny.rosen@example.com',
        payment_method: payMethod.paymentMethod.id
      }
    )
    });
      
  return (await response.json());
    
}


</script>

<div id="card-element" class="MyCardElement">
  <!-- Elements will create input elements here -->
</div>

<!-- We'll put the error messages in this element -->
<div id="card-errors" role="alert"></div>

<button on:click={createPayment} id="submit">Pay</button>

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