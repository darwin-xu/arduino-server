#!/usr/bin/env node

/**
 * Food Analysis Equipment Simulator
 *
 * This program simulates the equipment that captures food images,
 * weighs them, and sends the data to the food analysis server.
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

// Configuration
const SERVER_URL = 'http://localhost:3000';
const SAMPLE_IMAGES_DIR = path.join(__dirname, 'sample-images');
const SIMULATION_INTERVAL = 10000; // 10 seconds between simulations

// Sample food data for simulation
const sampleFoods = [
    { name: 'apple.jpg', weight: 185, type: 'Apple' },
    { name: 'banana.jpg', weight: 120, type: 'Banana' },
    { name: 'orange.jpg', weight: 154, type: 'Orange' },
    { name: 'sandwich.jpg', weight: 250, type: 'Sandwich' },
    { name: 'salad.jpg', weight: 200, type: 'Salad' },
];

class FoodAnalysisEquipment {
    constructor() {
        this.isRunning = false;
        this.simulationCount = 0;
    }

    async initialize() {
        console.log('🔧 Initializing Food Analysis Equipment Simulator...');

        // Create sample images directory if it doesn't exist
        if (!fs.existsSync(SAMPLE_IMAGES_DIR)) {
            fs.mkdirSync(SAMPLE_IMAGES_DIR, { recursive: true });
            console.log('📁 Created sample-images directory');
            console.log(
                '💡 Place some sample food images in the sample-images folder for better simulation'
            );
        }

        // Check server connectivity
        await this.checkServerConnection();
        console.log('✅ Equipment simulator initialized successfully\n');
    }

    async checkServerConnection() {
        try {
            const response = await axios.get(`${SERVER_URL}/api/health`);
            if (response.data.status === 'OK') {
                console.log('🌐 Connected to food analysis server');
            } else {
                throw new Error('Server health check failed');
            }
        } catch (error) {
            console.error('❌ Failed to connect to server:', error.message);
            console.log('💡 Make sure the server is running at', SERVER_URL);
            process.exit(1);
        }
    }

    createPlaceholderImage() {
        // Create a simple placeholder image file for simulation
        const placeholderPath = path.join(SAMPLE_IMAGES_DIR, 'placeholder.jpg');

        if (!fs.existsSync(placeholderPath)) {
            // Create a minimal JPEG file header for simulation
            const jpegHeader = Buffer.from([
                0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46,
                0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
                0xff, 0xd9,
            ]);
            fs.writeFileSync(placeholderPath, jpegHeader);
        }

        return placeholderPath;
    }

    getRandomFood() {
        return sampleFoods[Math.floor(Math.random() * sampleFoods.length)];
    }

    getRandomWeight(baseWeight) {
        // Add some variation to the weight (±20%)
        const variation = (Math.random() - 0.5) * 0.4;
        return Math.round(baseWeight * (1 + variation));
    }

    async captureAndAnalyze() {
        try {
            this.simulationCount++;
            console.log(
                `\n🔄 Simulation #${this.simulationCount} - Starting food capture and analysis...`
            );

            // Simulate the equipment weighing the food
            console.log('⚖️  Weighing food...');
            await this.delay(1000);

            // Get random food data
            const foodData = this.getRandomFood();
            const weight = this.getRandomWeight(foodData.weight);

            console.log(`📏 Detected weight: ${weight}g`);

            // Simulate capturing image
            console.log('📸 Capturing food image...');
            await this.delay(1500);

            // Check for sample images or use placeholder
            const imageFiles = fs.existsSync(SAMPLE_IMAGES_DIR)
                ? fs
                      .readdirSync(SAMPLE_IMAGES_DIR)
                      .filter(file =>
                          file.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg)$/)
                      )
                : [];

            let imagePath;
            if (imageFiles.length > 0) {
                const randomImage =
                    imageFiles[Math.floor(Math.random() * imageFiles.length)];
                imagePath = path.join(SAMPLE_IMAGES_DIR, randomImage);
                console.log(`📷 Using sample image: ${randomImage}`);
            } else {
                imagePath = this.createPlaceholderImage();
                console.log(
                    '📷 Using placeholder image (add real images to sample-images folder for better simulation)'
                );
            }

            // Simulate transmission to server
            console.log('📡 Transmitting data to analysis server...');
            await this.sendToServer(imagePath, weight);

            console.log(
                '✅ Analysis complete! Results should appear on the web interface.'
            );
        } catch (error) {
            console.error(
                '❌ Error during capture and analysis:',
                error.message
            );
        }
    }

    async sendToServer(imagePath, weight) {
        try {
            const formData = new FormData();

            // Add the image file
            const imageStream = fs.createReadStream(imagePath);
            formData.append('foodImage', imageStream);

            // Add the weight
            formData.append('weight', weight.toString());

            // Send to server
            const response = await axios.post(
                `${SERVER_URL}/api/analyze-food`,
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                    },
                    timeout: 10000, // 10 second timeout
                }
            );

            if (response.data.success) {
                console.log('📊 Server response:', {
                    foodType: response.data.data.analysis.foodType,
                    confidence: `${(response.data.data.analysis.confidence * 100).toFixed(1)}%`,
                    calories: response.data.data.analysis.nutrition.calories,
                });
            } else {
                throw new Error('Server returned unsuccessful response');
            }
        } catch (error) {
            if (error.response) {
                throw new Error(
                    `Server error: ${error.response.status} - ${error.response.data.error || error.response.statusText}`
                );
            } else if (error.request) {
                throw new Error(
                    'No response from server - check if server is running'
                );
            } else {
                throw new Error(`Request error: ${error.message}`);
            }
        }
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    start() {
        if (this.isRunning) {
            console.log('⚠️  Equipment simulator is already running');
            return;
        }

        this.isRunning = true;
        console.log('🚀 Starting equipment simulator...');
        console.log(
            `⏱️  Will simulate food analysis every ${SIMULATION_INTERVAL / 1000} seconds`
        );
        console.log('⛔ Press Ctrl+C to stop\n');

        // Start the simulation loop
        this.simulationLoop();
    }

    async simulationLoop() {
        while (this.isRunning) {
            await this.captureAndAnalyze();

            if (this.isRunning) {
                console.log(
                    `⏳ Waiting ${SIMULATION_INTERVAL / 1000} seconds before next simulation...`
                );
                await this.delay(SIMULATION_INTERVAL);
            }
        }
    }

    stop() {
        console.log('\n🛑 Stopping equipment simulator...');
        this.isRunning = false;
        console.log('✅ Equipment simulator stopped');
    }
}

// CLI Interface
async function main() {
    const equipment = new FoodAnalysisEquipment();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        equipment.stop();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        equipment.stop();
        process.exit(0);
    });

    try {
        await equipment.initialize();

        // Check command line arguments
        const args = process.argv.slice(2);

        if (args.includes('--help') || args.includes('-h')) {
            console.log(`
🍎 Food Analysis Equipment Simulator

Usage:
  node equipment-simulator.js [options]

Options:
  --once, -o     Run simulation once and exit
  --help, -h     Show this help message

Default behavior: Run continuous simulation every 10 seconds

Examples:
  node equipment-simulator.js          # Run continuous simulation
  node equipment-simulator.js --once   # Run once and exit
      `);
            return;
        }

        if (args.includes('--once') || args.includes('-o')) {
            console.log('🔄 Running single simulation...');
            await equipment.captureAndAnalyze();
            console.log('✅ Single simulation complete');
        } else {
            equipment.start();
        }
    } catch (error) {
        console.error('💥 Fatal error:', error.message);
        process.exit(1);
    }
}

// Run the program
if (require.main === module) {
    main();
}

module.exports = FoodAnalysisEquipment;
