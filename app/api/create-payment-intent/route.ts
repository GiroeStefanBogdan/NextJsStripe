import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    // Set the CORS headers
    const response = NextResponse.json({ clientSecret: paymentIntent.client_secret });
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173'); // Allow your React app origin
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Allow necessary methods
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type'); // Allow necessary headers

    return response;
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
        { error: `Internal Server Error: ${error}` },
        { status: 500 }
    );
  }
}

// Handle preflight OPTIONS request
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
