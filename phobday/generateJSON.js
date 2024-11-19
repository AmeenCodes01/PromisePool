const fs = require("fs");
const path = require("path");

const imagesDir = path.join(__dirname, "public/images"); // Path to your images folder
const outputFilePath = path.join(__dirname, "data/images.json"); // Output JSON file

// Read the files in the folder
fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  // Filter only image files (e.g., jpg, png, etc.)
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const imageFiles = files.filter((file) =>
    imageExtensions.includes(path.extname(file).toLowerCase()),
  );

  // Create JSON objects with name and path
  const images = imageFiles.map((file) => ({
    name: path.basename(file, path.extname(file)), // File name without extension
    path: `/images/${file}`, // Relative path for public folder
  }));

  // Write to JSON file
  fs.writeFile(outputFilePath, JSON.stringify(images, null, 2), (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log("Image data saved to:", outputFilePath);
    }
  });
});
