import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";

// Configure your Cloudinary credentials
cloudinary.config({
  cloud_name: "djbbyiiqc",
  api_key: "398115653374183",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to convert binary data to a readable stream
function bufferToStream(binary: Buffer) {
  const stream = new Readable();
  stream.push(binary);
  stream.push(null); // indicates end-of-file basically - the end of the stream
  return stream;
}

async function uploadImageToCloudinaryByUrl(imageUrl: string, imageId: string) {
  const result = await cloudinary.uploader.upload(
    imageUrl,
    { public_id: imageId },
    function (error, result) {
      console.log(result);
      return result;
    }
  );
}

// Example function to handle image upload
async function uploadBinaryImageToCloudinary(binaryData: Buffer) {
  try {
    const imageStream = bufferToStream(binaryData);

    // Upload the image
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
      },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    );

    imageStream.pipe(result);

    // The result contains the URL of the uploaded image
    console.log("Uploaded image URL:", result);
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
  }
}

// Your existing code to receive the image data
// ...

// Example of using the upload function with the received binary image data
// uploadImageToCloudinary(imageData).then((url) => {
//   console.log("Image uploaded to:", url);
// Send the URL back to the user or perform other actions
// });
