<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Food Analysis Server - Copilot Instructions

This is a Node.js Express server for food image recognition and nutrition analysis. The project focuses on:

## Project Overview

- **Purpose**: Upload food images, analyze them for nutrition information, and provide health suggestions
- **Tech Stack**: Node.js, Express.js, Multer (file uploads), CORS, Helmet, Morgan
- **Frontend**: Vanilla HTML/CSS/JavaScript with modern styling
- **File Handling**: Images stored in /uploads directory

## Key Features

1. Image upload with drag-and-drop functionality
2. Food weight input for accurate nutrition calculation
3. Mock food recognition (ready for real AI integration)
4. Nutrition analysis and health suggestions
5. Responsive web interface

## Code Patterns to Follow

- Use async/await for asynchronous operations
- Implement proper error handling with try-catch blocks
- Follow REST API conventions for endpoints
- Use middleware for security (helmet), logging (morgan), and CORS
- Validate file types and sizes for uploads
- Format code with Prettier (configured in .prettierrc)

## Development Guidelines

- Use `npm run dev` for development with auto-restart
- Use `npm run format` to format code with Prettier
- Keep environment variables in .env file
- Implement proper error responses with appropriate HTTP status codes
- Use descriptive variable names and add comments for complex logic

## Future Integration Points

- Replace mock food recognition with actual AI/ML service
- Add database integration for storing analysis history
- Implement user authentication and profiles
- Add more detailed nutrition database
- Consider adding barcode scanning functionality
