<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Food Analysis Server - Coding Standards & Conventions

## File Organization Standards

### Separation of Concerns

**Always split HTML files into separate files for better organization:**

```
public/
├── index.html              # HTML structure only
├── css/
│   └── index.css          # All CSS styles
└── js/
    └── index.js           # All JavaScript logic
```

**Example refactored structure:**

- `simple-display.html` → `simple-display.html` + `css/simple-display.css` + `js/simple-display.js`
- `test.html` → `test.html` + `js/test.js`
- `index.html` → `index.html` + `css/index.css` + `js/index.js`

**HTML files should only contain:**

- Document structure (`<!doctype html>`, `<head>`, `<body>`)
- Semantic markup and content
- Links to external CSS and JS files

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Page Title</title>
        <link rel="stylesheet" href="css/page-name.css" />
    </head>
    <body>
        <!-- HTML content only -->
        <script src="js/page-name.js"></script>
    </body>
</html>
```

**CSS files (`css/`) should contain:**

- All styling rules and media queries
- No inline styles in HTML

**JavaScript files (`js/`) should contain:**

- All interactive logic and API calls
- No inline `<script>` tags in HTML (except for external CDN links)

## Code Style & Formatting

Use **Prettier** for all formatting (configured in `.prettierrc`):

- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for strings (`'hello'` not `"hello"`)
- **Indentation**: 4 spaces, no tabs
- **Line length**: 80 characters max
- **Trailing commas**: ES5 style (`{ a: 1, b: 2, }`)
- **Arrow functions**: Avoid parentheses for single parameters (`x => x.id`)

**Format before committing**: `npm run format`

## Variable & Function Naming

### Constants

```javascript
const SERVER_URL = 'http://localhost:3000'; // SCREAMING_SNAKE_CASE
const SIMULATION_INTERVAL = 10000; // All caps with underscores
```

### Variables & Functions

```javascript
const latestAnalysis = null; // camelCase
const uploadsDir = path.join(__dirname, 'uploads'); // camelCase
async function checkServerConnection() {} // camelCase functions
```

### Files & Directories

```javascript
// kebab-case for files
equipment-simulator.js
simple-display.html

// camelCase for directories
sampleImages/
uploadsDir/
```

## Logging Conventions

### Use Emoji Prefixes for Clarity

```javascript
// Server startup
console.log('🍎 Food Analysis Server running on http://localhost:3000');
console.log('📁 Uploads directory: /path/to/uploads');

// Equipment simulator
console.log('🔧 Initializing Food Analysis Equipment Simulator...');
console.log('⚖️  Weighing food...');
console.log('📸 Capturing food image...');
console.log('📡 Transmitting data to analysis server...');

// Success/Error states
console.log('✅ Equipment simulator initialized successfully');
console.error('❌ Failed to connect to server:', error.message);

// Frontend (browser console)
console.log('🔍 Checking for new analysis data...');
console.log('📡 API Response:', result);
console.log('🖼️ Image path:', imagePath);
```

### Error Logging Pattern

```javascript
try {
    // operation
} catch (error) {
    console.error('❌ Error during [operation]:', error.message);
    // Handle gracefully, don't crash
}
```

## API Response Standards

### Success Response

```javascript
res.json({
    success: true,
    data: analysisResult,
});
```

### Error Response

```javascript
res.status(400).json({
    error: 'Descriptive error message',
});
```

### Health Check

```javascript
res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
});
```

## File Upload Patterns

### Filename Generation

```javascript
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
const filename =
    file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
// Result: foodImage-1753509174625-123456789.jpg
```

### File Validation

```javascript
// Accept only images
if (file.mimetype.startsWith('image/')) {
    cb(null, true);
} else {
    cb(new Error('Only image files are allowed!'), false);
}
```

## Error Handling Conventions

### Multer Error Middleware

```javascript
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res
                .status(400)
                .json({ error: 'File too large. Maximum size is 5MB.' });
        }
    }
    // Handle other errors...
});
```

### Async Route Handlers

```javascript
app.post('/api/analyze-food', upload.single('foodImage'), async (req, res) => {
    try {
        // Validate inputs first
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        const { weight } = req.body;
        if (!weight || isNaN(weight) || weight <= 0) {
            return res.status(400).json({ error: 'Valid weight is required' });
        }

        // Process...
    } catch (error) {
        console.error('Error analyzing food:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
```

## Frontend JavaScript Patterns

### Polling with Cache Busting

```javascript
const response = await fetch('/api/latest-analysis?t=' + Date.now());
```

### ID-based Change Detection

```javascript
if (result.data.id !== lastAnalysisId) {
    lastAnalysisId = result.data.id;
    displayResults(result.data);
}
```

### Graceful Error Handling

```javascript
try {
    const response = await fetch('/api/endpoint');
    if (response.ok) {
        // Handle success
    } else {
        console.error('❌ API request failed:', response.status);
    }
} catch (error) {
    console.error('❌ Network error:', error);
    // Continue operation, don't break UI
}
```

## Development Environment

### Essential Commands

```bash
npm run dev          # Development with auto-restart
npm run format       # Format all code with Prettier
npm run simulate     # Continuous equipment simulation
npm run simulate-once # Single test simulation
```

### VS Code Simple Browser Compatibility

```javascript
// Required helmet config - DO NOT change
app.use(
    helmet({
        contentSecurityPolicy: false, // Allows iframe embedding
        frameguard: false, // Removes X-Frame-Options blocking
    })
);
```

## Testing Approach

**No formal test framework** - Use manual testing:

- `http://localhost:3000/test.html` - API response testing
- `http://localhost:3000/simple-display.html` - Debug console with logs
- Equipment simulator for end-to-end testing

## Configuration Management

### Environment Variables (.env)

```properties
PORT=3000
```

### Constants at Top of Files

```javascript
const SERVER_URL = 'http://localhost:3000';
const SIMULATION_INTERVAL = 10000; // 10 seconds
```

**Always use `const` for configuration values that don't change during runtime.**
