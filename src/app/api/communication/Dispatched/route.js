import { default as twilio } from "twilio";

const num = "+918438434868";

export async function POST() {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    await client.messages.create({
      body: `✨ Thank you for shopping with Sokkai Clothing! ✨
      📦 Your order has been dispatched on 26/11.
      🚚 It will be delivered to you soon!
      
      We appreciate your business and wish you a delightful shopping experience! 🛍️😊`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${num}`,
    });

    console.log("Message sent to WhatsApp successfully.");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Dispatched message sent sucessfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err.message);

    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
