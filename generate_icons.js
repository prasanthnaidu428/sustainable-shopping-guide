// This script generates simple icon files for the extension
const fs = require('fs');
const { createCanvas } = require('canvas');

// Create images directory if it doesn't exist
if (!fs.existsSync('images')) {
    fs.mkdirSync('images');
}

// Function to generate an icon with a given size
function generateIcon(size, filename) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Draw background
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw leaf
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(size/2, size/2, size/3, size/2, Math.PI/4, 0, Math.PI * 2);
    ctx.fill();
    
    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`images/${filename}`, buffer);
}

// Generate icons in different sizes
generateIcon(16, 'icon16.png');
generateIcon(48, 'icon48.png');
generateIcon(128, 'icon128.png');

console.log('Icons generated successfully!');
