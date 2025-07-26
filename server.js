const express = require('express');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Store the latest analysis result in memory (in production, use a database)
let latestAnalysis = null;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(
    helmet({
        contentSecurityPolicy: false, // Disable CSP entirely for VS Code compatibility
        frameguard: false, // Disable X-Frame-Options to allow VS Code Simple Browser
    })
);
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                '-' +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for food image analysis
app.post('/api/analyze-food', upload.single('foodImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        const { weight } = req.body;

        if (!weight || isNaN(weight) || weight <= 0) {
            return res.status(400).json({ error: 'Valid weight is required' });
        }

        // TODO: Implement actual food recognition and nutrition analysis
        // For now, we'll return mock data
        const mockAnalysis = {
            foodType: 'Apple',
            confidence: 0.85,
            nutrition: {
                calories: Math.round((52 * weight) / 100), // calories per 100g for apple
                protein: Math.round((0.3 * weight) / 100),
                carbs: Math.round((14 * weight) / 100),
                fat: Math.round((0.2 * weight) / 100),
                fiber: Math.round((2.4 * weight) / 100),
            },
            healthSuggestions: [
                'Apples are rich in fiber and vitamin C',
                'Great for maintaining healthy blood sugar levels',
                'The fiber content helps with digestive health',
                'Consider pairing with protein for a balanced snack',
            ],
        };

        const analysisResult = {
            id: Date.now(), // Simple ID for tracking new results
            image: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                path: `/uploads/${req.file.filename}`,
            },
            weight: parseFloat(weight),
            analysis: mockAnalysis,
            timestamp: new Date().toISOString(),
        };

        // Store as latest analysis
        latestAnalysis = analysisResult;

        res.json({
            success: true,
            data: analysisResult,
        });
    } catch (error) {
        console.error('❌ Error during food analysis:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get latest analysis result
app.get('/api/latest-analysis', (req, res) => {
    if (latestAnalysis) {
        res.json({
            success: true,
            data: latestAnalysis,
        });
    } else {
        res.json({
            success: false,
            error: 'No analysis data available',
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res
                .status(400)
                .json({ error: 'File too large. Maximum size is 5MB.' });
        }
    }

    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({ error: 'Only image files are allowed.' });
    }

    console.error('❌ Internal server error:', error.message);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🍎 Food Analysis Server running on http://localhost:${PORT}`);
    console.log(`📁 Uploads directory: ${uploadsDir}`);
});
