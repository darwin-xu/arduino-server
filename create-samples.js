const fs = require('fs');
const path = require('path');

// Create a simple colored square image in ASCII Art format that browsers can display
// This creates a more visible placeholder than the minimal JPEG

function createBetterPlaceholder(filename, color, foodType) {
    // Create a simple SVG placeholder image
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="${color}"/>
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">${foodType}</text>
  <text x="200" y="180" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">Sample Food Image</text>
</svg>`;

    fs.writeFileSync(path.join(__dirname, 'sample-images', filename), svg);
}

// Create sample food images
const sampleFoods = [
    { filename: 'apple.svg', color: '#ff6b6b', name: '🍎 Apple' },
    { filename: 'banana.svg', color: '#ffd93d', name: '🍌 Banana' },
    { filename: 'orange.svg', color: '#ff8c42', name: '🍊 Orange' },
    { filename: 'sandwich.svg', color: '#6c7b7f', name: '🥪 Sandwich' },
    { filename: 'salad.svg', color: '#4ecdc4', name: '🥗 Salad' },
];

console.log('🎨 Creating sample food images...');

sampleFoods.forEach(food => {
    createBetterPlaceholder(food.filename, food.color, food.name);
    console.log(`✅ Created ${food.filename}`);
});

console.log('🎉 Sample images created successfully!');
console.log(
    '💡 You can also add real food photos (.jpg, .png, .gif) to the sample-images folder for even better simulation.'
);
