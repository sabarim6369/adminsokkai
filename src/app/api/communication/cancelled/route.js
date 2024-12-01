import { default as twilio } from "twilio";

const num = "+918438434868";

export async function POST() {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    await client.messages.create({
      body: `Dear Customer,

We regret to inform you that we are unable to fulfill your requested service at this time due to unforeseen circumstances. We sincerely apologize for the inconvenience caused.

Thank you for your understanding and patience. 

Best Regards,  
Sokkai Team`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${num}`,
    });

    console.log("Message sent to WhatsApp successfully.");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Dispatched message sent successfully",
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
