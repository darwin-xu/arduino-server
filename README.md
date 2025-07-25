# 🍎 Food Analysis & Nutrition Tracker

A Node.js web server for automated food image recognition and nutrition analysis. The system is designed to work with equipment that automatically captures and weighs food, then transmits the data to the server for analysis.

## Features

- 🤖 **Automated Equipment Integration**: Receives data from food analysis equipment via HTTP API
- ⚖️ **Automatic Weight Detection**: Equipment provides precise weight measurements
- 🔍 **Food Recognition**: Analyze uploaded images (currently using mock data, ready for AI integration)
- 📊 **Nutrition Analysis**: Get detailed nutritional information based on weight and food type
- 💡 **Health Suggestions**: Receive personalized health recommendations
- 📱 **Real-time Display**: Results appear automatically on the web interface
- 🖥️ **Clean Interface**: Simple welcome page that displays analysis results

## System Architecture

- **Equipment**: Captures images and weighs food automatically
- **Web Server**: Processes data and provides analysis
- **Web Interface**: Displays welcome message and shows results in real-time
- **Simulator**: Included for testing and demonstration

## Tech Stack

- **Backend**: Node.js, Express.js
- **File Upload**: Multer
- **HTTP Client**: Axios, form-data
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Environment**: dotenv
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Code Formatting**: Prettier

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd food-analysis-server
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create environment file:

    ```bash
    cp .env.example .env
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

5. Open your browser and visit: `http://localhost:3000`

## Equipment Simulation

To test the system without physical equipment, use the included simulator:

1. **Single test run:**

    ```bash
    npm run simulate-once
    ```

2. **Continuous simulation (every 10 seconds):**

    ```bash
    npm run simulate
    ```

3. **Add sample images for better simulation:**
    ```bash
    # Copy your food images to the sample-images folder
    cp /path/to/food/images/* sample-images/
    ```

For detailed simulator documentation, see [EQUIPMENT-SIMULATOR.md](EQUIPMENT-SIMULATOR.md)

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-restart
- `npm run simulate` - Run equipment simulator continuously
- `npm run simulate-once` - Run equipment simulator once
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## API Endpoints

### POST /api/analyze-food

Upload a food image and get nutrition analysis.

**Request:**

- `foodImage`: Image file (multipart/form-data)
- `weight`: Food weight in grams

**Response:**

```json
{
    "success": true,
    "data": {
        "image": {
            "filename": "foodImage-1234567890.jpg",
            "originalName": "apple.jpg",
            "size": 524288,
            "path": "/uploads/foodImage-1234567890.jpg"
        },
        "weight": 150,
        "analysis": {
            "foodType": "Apple",
            "confidence": 0.85,
            "nutrition": {
                "calories": 78,
                "protein": 0.45,
                "carbs": 21,
                "fat": 0.3,
                "fiber": 3.6
            },
            "healthSuggestions": [
                "Apples are rich in fiber and vitamin C",
                "Great for maintaining healthy blood sugar levels"
            ]
        },
        "timestamp": "2025-01-01T12:00:00.000Z"
    }
}
```

### GET /api/health

Health check endpoint.

### GET /api/latest-analysis

Get the most recent food analysis result. Used by the web interface to display real-time results.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1640995200000,
    "image": { "filename": "...", "path": "..." },
    "weight": 150,
    "analysis": { "foodType": "Apple", "confidence": 0.85, "nutrition": {...} },
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

## Project Structure

```
.
├── public/
│   └── index.html              # Simplified welcome interface
├── uploads/                    # Uploaded images storage
├── sample-images/              # Sample images for simulator
├── .github/
│   └── copilot-instructions.md # Copilot guidelines
├── server.js                   # Main server file
├── equipment-simulator.js      # Equipment simulation program
├── EQUIPMENT-SIMULATOR.md      # Simulator documentation
├── package.json                # Dependencies and scripts
├── .prettierrc                 # Prettier configuration
├── .env                        # Environment variables
└── README.md                   # This file
```

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)

### File Upload Limits

- Maximum file size: 5MB
- Accepted formats: Images only (jpg, png, gif, etc.)

## Development Notes

- The current implementation uses mock data for food recognition
- Ready for integration with actual AI/ML food recognition services
- Images are stored locally in the `uploads` directory
- Error handling includes proper HTTP status codes and user-friendly messages

## Future Enhancements

- [ ] Integrate with real food recognition AI service
- [ ] Add database for storing analysis history
- [ ] Implement user authentication
- [ ] Add comprehensive nutrition database
- [ ] Support for barcode scanning
- [ ] Meal planning features
- [ ] Export analysis reports

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Format code with `npm run format`
5. Submit a pull request

## License

ISC License
