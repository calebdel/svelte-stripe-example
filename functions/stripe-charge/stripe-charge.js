// with thanks https://github.com/alexmacarthur/netlify-lambda-function-example/blob/68a0cdc05e201d68fe80b0926b0af7ff88f15802/lambda-src/purchase.js

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const statusCode = 200;
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = function (event, context, callback) {
  //-- We only care to do anything if this is our POST request.
  if (event.httpMethod !== "POST" || !event.body) {
    callback(null, {
      statusCode,
      headers,
      body: "",
    });
  }

  //-- Parse the body contents into an object.
  const data = JSON.parse(event.body);

  //-- Make sure we have all required data. Otherwise, escape.
  if (!data.email || !data.payment_method) {
    console.error("Required information is missing.");

    callback(null, {
      statusCode,
      headers,
      body: JSON.stringify({ status: "missing-information" }),
    });

    return;
  }

  //-- Create Stripe Customer and add their Subscription
  //-- Should also check if customer already exists here
  // Just to test we create a new customer each time

  stripe.customers
    .create({
      payment_method: data.payment_method,
      email: data.email,
      invoice_settings: {
        default_payment_method: data.payment_method,
      },
      metadata: {
        referral: data.referral,
      },
    })

    .then((customer) => {
      stripe.subscriptions
        .create({
          customer: customer.id,
          items: [{ plan: "pro_yearly" }],
          expand: ["latest_invoice.payment_intent"],
        })

        .then((result) =>
          console.log(`Status: ${result.latest_invoice.payment_intent.status}`)
        )

        .catch((err) => console.log("subscription error" + err));
    })

    .catch((err) => console.log("customer error" + err));
};
