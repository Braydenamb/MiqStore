import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function run() {
  try {
    const result = await cloudinary.search
      .expression('folder:Gallery')
      .max_results(10)
      .execute();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}
run();
