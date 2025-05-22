const fs = require('fs');
const path = require('path');

// Create the icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// List of icon sizes to generate
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate a simple SVG for each size
sizes.forEach(size => {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#111827"/>
    <text x="50%" y="50%" font-family="Arial" font-size="${size/4}px" fill="white" text-anchor="middle" dominant-baseline="middle">C&G</text>
  </svg>`;
  
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg);
  console.log(`Generated icon-${size}x${size}.svg`);
});

console.log('All icons generated successfully!');
