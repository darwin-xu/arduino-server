# 🍎 Food Analysis & Nutrition Tracker

A Node.js web server that allows users to upload food images and receive nutritional information and health suggestions.

## Features

- 📸 **Image Upload**: Drag-and-drop or click to upload food images
- ⚖️ **Weight Input**: Enter food weight for accurate nutrition calculations
- 🔍 **Food Recognition**: Analyze uploaded images (currently using mock data)
- 📊 **Nutrition Analysis**: Get detailed nutritional information
- 💡 **Health Suggestions**: Receive personalized health recommendations
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Backend**: Node.js, Express.js
- **File Upload**: Multer
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

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-restart
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

## Project Structure

```
.
├── public/
│   └── index.html          # Frontend interface
├── uploads/                # Uploaded images storage
├── .github/
│   └── copilot-instructions.md  # Copilot guidelines
├── server.js               # Main server file
├── package.json            # Dependencies and scripts
├── .prettierrc             # Prettier configuration
├── .env                    # Environment variables
└── README.md               # This file
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
