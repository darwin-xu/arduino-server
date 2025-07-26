// Poll for new analysis results
let pollInterval;
let lastAnalysisId = null;

function startPolling() {
    console.log('🔄 Starting to poll for new analysis results...');
    // Check for new results every 2 seconds
    pollInterval = setInterval(checkForNewData, 2000);
}

async function checkForNewData() {
    try {
        console.log('🔍 Checking for new analysis data...');
        const response = await fetch('/api/latest-analysis?t=' + Date.now());
        console.log('📡 Response status:', response.status);
        if (response.ok) {
            const result = await response.json();
            console.log('📡 API Response:', result);
            if (result.success && result.data) {
                console.log(
                    '✅ Data found, current ID:',
                    result.data.id,
                    'last ID:',
                    lastAnalysisId
                );
                if (result.data.id !== lastAnalysisId) {
                    console.log(
                        '📊 New analysis result received:',
                        result.data.id
                    );
                    console.log('🖼️ Image path:', result.data.image.path);
                    lastAnalysisId = result.data.id;
                    showLoading();

                    // Show loading for 2 seconds, then display results
                    setTimeout(function () {
                        displayResults(result.data);
                    }, 2000);
                } else {
                    console.log('⏸️ Same analysis ID, no update needed');
                }
            } else {
                // No data available yet
                console.log('⚠️ No analysis data available');
                updateStatus(
                    'System Ready - Waiting for Equipment',
                    'No recent analysis'
                );
            }
        } else {
            console.error('❌ API request failed:', response.status);
        }
    } catch (error) {
        console.error('❌ Error checking for new data:', error);
        updateStatus(
            'Connection Error - Check Server',
            'Last error: ' + new Date().toLocaleTimeString()
        );
    }
}

function updateStatus(statusText, lastUpdateText) {
    document.getElementById('statusText').textContent = statusText;
    if (lastUpdateText) {
        document.getElementById('lastUpdate').textContent = lastUpdateText;
    }
}

function showLoading() {
    console.log('⏳ Showing loading animation...');
    updateStatus('Processing Food Analysis...', 'Analysis in progress...');
    document.getElementById('loadingSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingSection').style.display = 'none';
}

function displayResults(data) {
    console.log('📋 Displaying analysis results:', data);
    console.log('🖼️ Image data:', data.image);
    console.log('📂 Full image path:', data.image.path);

    hideLoading();
    updateStatus(
        'Analysis Complete',
        'Last analysis: ' + new Date(data.timestamp).toLocaleString()
    );

    const resultsSection = document.getElementById('resultsSection');
    const { analysis, weight, image, timestamp } = data;

    const imageHtml = `<img src="${image.path}" alt="Food Image: ${image.originalName}" class="food-image" 
                            onload="console.log('✅ Image loaded successfully: ${image.path}')" 
                            onerror="console.error('❌ Image failed to load: ${image.path}')" />`;

    resultsSection.innerHTML = `
      <h2>🔍 Food Analysis Results</h2>
      
      <div style="margin: 20px 0;">
        ${imageHtml}
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3>📊 Food Identification</h3>
        <p><strong>Food Type:</strong> ${analysis.foodType}</p>
        <p><strong>Confidence:</strong> ${(analysis.confidence * 100).toFixed(1)}%</p>
        <p><strong>Weight:</strong> ${weight}g</p>
        <p><strong>Image:</strong> ${image.originalName}</p>
        <p><strong>Image Path:</strong> <a href="${image.path}" target="_blank">${image.path}</a></p>
      </div>
      
      <h3>🥗 Nutritional Information (per ${weight}g)</h3>
      <div class="nutrition-grid">
        <div class="nutrition-item">
          <div class="value">${analysis.nutrition.calories}</div>
          <div class="label">Calories</div>
        </div>
        <div class="nutrition-item">
          <div class="value">${analysis.nutrition.protein}g</div>
          <div class="label">Protein</div>
        </div>
        <div class="nutrition-item">
          <div class="value">${analysis.nutrition.carbs}g</div>
          <div class="label">Carbs</div>
        </div>
        <div class="nutrition-item">
          <div class="value">${analysis.nutrition.fat}g</div>
          <div class="label">Fat</div>
        </div>
        <div class="nutrition-item">
          <div class="value">${analysis.nutrition.fiber}g</div>
          <div class="label">Fiber</div>
        </div>
      </div>
      
      <div class="suggestions">
        <h3>💡 Health Suggestions</h3>
        <ul>
          ${analysis.healthSuggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
        </ul>
      </div>
    `;

    console.log('🎯 Results section updated, making visible...');
    resultsSection.style.display = 'block';

    // Hide results after 30 seconds and resume normal polling
    setTimeout(() => {
        console.log('⏰ Hiding results after 30 seconds...');
        hideResults();
        updateStatus(
            'System Ready - Waiting for Equipment',
            'Ready for next analysis'
        );
    }, 30000);
}

function hideResults() {
    document.getElementById('resultsSection').style.display = 'none';
}

// Initialize the system
document.addEventListener('DOMContentLoaded', function () {
    console.log('🍎 Food Analysis System ready!');
    console.log('🔧 Setting up initial status...');
    updateStatus(
        'System Ready - Waiting for Equipment',
        'Page loaded at ' + new Date().toLocaleTimeString()
    );
    console.log('🔄 Starting polling system...');
    startPolling();
    console.log('✅ System initialization complete!');
});

// Cleanup on page unload
window.addEventListener('beforeunload', function () {
    if (pollInterval) {
        clearInterval(pollInterval);
    }
});
