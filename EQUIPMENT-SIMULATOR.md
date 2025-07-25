# 🍎 Food Analysis Equipment Simulator

This program simulates the equipment that captures food images, weighs them, and sends the data to the food analysis server using standard HTTP protocol.

## Quick Start

1. **Make sure the server is running:**

    ```bash
    npm run dev
    ```

2. **Run a single simulation:**

    ```bash
    npm run simulate-once
    ```

3. **Run continuous simulation:**
    ```bash
    npm run simulate
    ```

## How It Works

The simulator mimics real equipment by:

1. **Weighing Food**: Generates random weights based on typical food weights
2. **Capturing Images**: Uses sample images or creates placeholder images
3. **Data Transmission**: Sends image and weight data via HTTP POST to `/api/analyze-food`
4. **Real-time Display**: Results automatically appear on the web interface

## Adding Sample Images

For more realistic simulation, add food images to the `sample-images/` folder:

```bash
# Add your food images
cp /path/to/your/food/images/* sample-images/

# Supported formats: .jpg, .jpeg, .png, .gif
```

## Usage Examples

```bash
# Run once and exit
node equipment-simulator.js --once

# Run continuous simulation (every 10 seconds)
node equipment-simulator.js

# Show help
node equipment-simulator.js --help
```

## API Communication

The simulator uses standard HTTP protocol to communicate with the server:

- **Endpoint**: `POST /api/analyze-food`
- **Content-Type**: `multipart/form-data`
- **Data**:
    - `foodImage`: Image file
    - `weight`: Weight in grams (string)

## Simulation Data

The simulator randomly selects from these food types:

- Apple (~185g)
- Banana (~120g)
- Orange (~154g)
- Sandwich (~250g)
- Salad (~200g)

Weights vary ±20% from base values for realistic simulation.

## Viewing Results

1. Open the web interface: http://localhost:3000
2. Run the simulator
3. Results will automatically appear on the web page within 2-3 seconds

The web interface polls the server every 3 seconds for new analysis results.
