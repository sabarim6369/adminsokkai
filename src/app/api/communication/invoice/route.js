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

export async function POST() {
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
      <h1 style="margin: 0; font-size: 24px;">THE HAPPY TOOTH</h1>
      <p style="margin: 0; font-size: 14px;">Make all checks payable to Utu Linna</p>
    </div>
    <div style="text-align: right;">
      <h3 style="margin: 0;">Invoice #5465</h3>
      <p style="margin: 0; font-size: 14px;">8/8/2023</p>
    </div>
  </div>

  <!-- Customer Information Section -->
  <div style="margin-top: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="width: 20%; font-weight: bold;">TO</td>
        <td style="width: 30%;">Utu Linna<br>Kendall Collins DDS</td>
        <td style="width: 20%; font-weight: bold;">CUSTOMER ID</td>
        <td style="width: 30%;">ABK967</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">ADDRESS</td>
        <td>234 5th Ave<br>Madison, WI 12131</td>
        <td style="font-weight: bold;">PHONE</td>
        <td>640-555-0146</td>
      </tr>
    </table>
  </div>

  <!-- Job Details Section -->
  <div style="margin-top: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="width: 20%; font-weight: bold;">SALESPERSON</td>
        <td style="width: 30%;">Jane</td>
        <td style="width: 20%; font-weight: bold;">JOB</td>
        <td style="width: 30%;">Dental Instrument Resupply</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">PAYMENT TERMS</td>
        <td>Due upon receipt</td>
        <td style="font-weight: bold;">DUE DATE</td>
        <td>8/8/2023</td>
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
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">100</td>
          <td style="padding: 10px; border: 1px solid #ccc;">Mouth mirror</td>
          <td style="padding: 10px; border: 1px solid #ccc;">0.25</td>
          <td style="padding: 10px; border: 1px solid #ccc;">25</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">6</td>
          <td style="padding: 10px; border: 1px solid #ccc;">Dental drill</td>
          <td style="padding: 10px; border: 1px solid #ccc;">645.23</td>
          <td style="padding: 10px; border: 1px solid #ccc;">3871.38</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">100</td>
          <td style="padding: 10px; border: 1px solid #ccc;">Curette</td>
          <td style="padding: 10px; border: 1px solid #ccc;">0.12</td>
          <td style="padding: 10px; border: 1px solid #ccc;">12</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">25</td>
          <td style="padding: 10px; border: 1px solid #ccc;">Syringe</td>
          <td style="padding: 10px; border: 1px solid #ccc;">1.33</td>
          <td style="padding: 10px; border: 1px solid #ccc;">33.25</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ccc;">100</td>
          <td style="padding: 10px; border: 1px solid #ccc;">Periodontal probe</td>
          <td style="padding: 10px; border: 1px solid #ccc;">0.22</td>
          <td style="padding: 10px; border: 1px solid #ccc;">22</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Totals Section -->
  <div style="margin-top: 20px; text-align: right;">
    <p style="margin: 5px 0;"><strong>SUBTOTAL:</strong> $3,963.63</p>
    <p style="margin: 5px 0;"><strong>SALES TAX:</strong> 0.06</p>
    <p style="margin: 5px 0; font-size: 18px;"><strong>TOTAL:</strong> $4,201.45</p>
  </div>

  <!-- Footer Section -->
  <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #000; color: #fff;">
    <div>
      <p style="margin: 0;">234-555-0126</p>
      <p style="margin: 0;">happytooth@example.com</p>
      <p style="margin: 0;">4321 Maplewood Ave | Nashville, TN 13141</p>
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

    // Create PDF from HTML
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

    // Generate an image (screenshot) of the PDF
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
