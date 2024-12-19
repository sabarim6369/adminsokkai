import puppeteer from "puppeteer";
import cloudinary from "cloudinary";
import fs from "fs";
import os from "os";
import path from "path";
import { default as twilio } from "twilio";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const num = "+918438434868";
export async function POST(request) {
  const body = await request.json();
  const { products, address } = body;
  console.log("products : ", products);

  try {
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
    </head>
    <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; line-height: 1.6;">
    
      <!-- Header Section -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background-color: #000; color: #fff;">
        <div>
<h1 style="margin: 0; font-size: 24px;">
  SO<span style="color: #87CEEB;">K</span>KAI-THE CLOTHING BRAND
</h1>
          <p style="margin: 0; font-size: 14px;">Make all checks payable to Mahendra Kumar</p>
        </div>
        <div style="text-align: right;">
          <h3 style="margin: 0;">Invoice #${new Date().getTime()}</h3>
          <p style="margin: 0; font-size: 14px;">${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    
      <!-- Customer Information Section -->
      <div style="margin-top: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 20%; font-weight: bold;">TO</td>
            <td style="width: 30%;">${address.name}<br>${address.location}</td>
            <td style="width: 20%; font-weight: bold;">PHONE</td>
            <td style="width: 30%;">${address.phone}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">ADDRESS</td>
            <td>${address.address.replace(/\n/g, "<br>")}</td>
            <td style="font-weight: bold;">TYPE</td>
            <td>${address.type}</td>
          </tr>
        </table>
      </div>
    
      <!-- Job Details Section -->
      <div style="margin-top: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 20%; font-weight: bold;">SALESPERSON</td>
            <td style="width: 30%;">Mahendra Kumar</td>
            <td style="width: 20%; font-weight: bold;">JOB</td>
            <td style="width: 30%;">Product Sale</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">PAYMENT TERMS</td>
            <td>Due upon receipt</td>
            <td style="font-weight: bold;">DUE DATE</td>
            <td>${new Date().toLocaleDateString()}</td>
          </tr>
        </table>
      </div>
    
      <!-- Invoice Items Section -->
      <div style="margin-top: 20px;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">QTY</th>
              <th style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">DESCRIPTION</th>
              <th style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">UNIT PRICE</th>
              <th style="padding: 10px; border: 1px solid #ccc; font-weight: bold;">LINE TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (product) => `
              <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">${product.quantity}</td>
                <td style="padding: 10px; border: 1px solid #ccc;">${product.name}</td>
                <td style="padding: 10px; border: 1px solid #ccc;">${product.originalprice}</td>
                <td style="padding: 10px; border: 1px solid #ccc;">${product.price}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    
      <!-- Totals Section -->
      <div style="margin-top: 20px; text-align: right;">
        <p style="margin: 5px 0;"><strong>UNIT TOTAL:</strong> $${products.reduce(
          (sum, product) => sum + product.originalprice,
          0
        )}</p>
        <p style="margin: 5px 0;"><strong>DELIVERYCHARGE:</strong>30</p>
        <p style="margin: 5px 0; font-size: 18px;">
  <strong>TOTAL:</strong> $${(
    products.reduce((sum, product) => sum + product.price, 0) + 30
  ).toFixed(2)}
</p>

      </div>
    
      <!-- Footer Section -->
      <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #000; color: #fff;">
        <div>
          <p style="margin: 0;">8438434868</p>
          <p style="margin: 0;">sokkai@example.com</p>
          <p style="margin: 0;">Pollachi, Coimbatore, Tamil Nadu, India</p>
        </div>
        <div>
          <h2 style="margin: 0;">THANK YOU</h2>
        </div>
      </div>
    
    </body>
    </html>
      `;
    const tempDir = os.tmpdir();
    const pdfFilePath = path.join(tempDir, "invoice.pdf");
    const imageFilePath = path.join(tempDir, "invoice_thumbnail.png");

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({
      path: pdfFilePath,
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "10mm", bottom: "20mm", left: "10mm" },
    });
    await browser.close();
    if (fs.existsSync(pdfFilePath)) {
      console.log(`PDF created successfully at ${pdfFilePath}`);
    } else {
      console.log("PDF creation failed. File not found.");
    }
    const imageBrowser = await puppeteer.launch();
    const imagePage = await imageBrowser.newPage();
    await imagePage.setContent(htmlContent);
    await imagePage.screenshot({
      path: imageFilePath,
      fullPage: true,
    });
    await imageBrowser.close();
    if (fs.existsSync(imageFilePath)) {
      console.log(`Image preview created successfully at ${imageFilePath}`);
    } else {
      console.log("Image creation failed. File not found.");
    }
    const uploadImageResponse = await cloudinary.v2.uploader.upload(
      imageFilePath,
      {
        resource_type: "image",
        folder: "sokkai/invoice_previews",
        public_id: "invoice_thumbnail",
        access_mode: "public",
      }
    );

    const imageUrl = uploadImageResponse.secure_url;
    console.log("Image uploaded to Cloudinary:", imageUrl);

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    await client.messages.create({
      body: `Invoice for your Order`,
      mediaUrl: imageUrl,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${num}`,
    });

    console.log("Image sent to WhatsApp successfully.");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Invoice sent successfully via WhatsApp.",
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
