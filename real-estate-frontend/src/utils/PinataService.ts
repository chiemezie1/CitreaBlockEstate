// PinataService.ts
import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;

const PINATA_UPLOAD_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

// Function to upload an image or video to Pinata
export async function uploadToPinata(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(PINATA_UPLOAD_URL, formData, {
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
    });
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw new Error("Failed to upload file to Pinata.");
  }
}

