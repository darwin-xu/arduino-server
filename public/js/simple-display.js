var lastAnalysisId = null;
var pollCount = 0;

function log(message) {
    console.log(message);
    var debug = document.getElementById('debug');
    debug.innerHTML +=
        new Date().toLocaleTimeString() + ': ' + message + '<br>';
    debug.scrollTop = debug.scrollTop + 1000;
}

function updateStatus(status, update) {
    document.getElementById('status').innerHTML = status;
    document.getElementById('lastUpdate').innerHTML = update || '';
}

function checkForData() {
    pollCount++;
    log('Poll #' + pollCount + ' - Checking for new data...');

    // Create XMLHttpRequest for better browser compatibility
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/latest-analysis?t=' + Date.now(), true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var result = JSON.parse(xhr.responseText);
                    log(
                        'API Response received: ' +
                            JSON.stringify(result).substring(0, 100) +
                            '...'
                    );

                    if (result.success && result.data) {
                        var currentId = result.data.id;
                        log(
                            'Current ID: ' +
                                currentId +
                                ', Last ID: ' +
                                lastAnalysisId
                        );

                        if (currentId !== lastAnalysisId) {
                            log('NEW DATA FOUND! Displaying results...');
                            lastAnalysisId = currentId;
                            displayResults(result.data);
                        } else {
                            log('Same data, no update needed');
                        }
                    } else {
                        log('No data available');
                        updateStatus(
                            'Waiting for Equipment',
                            'No analysis data'
                        );
                    }
                } catch (e) {
                    log('Error parsing JSON: ' + e.message);
                }
            } else {
                log('HTTP Error: ' + xhr.status);
                updateStatus('Connection Error', 'HTTP ' + xhr.status);
            }
        }
    };

    xhr.onerror = function () {
        log('Network error occurred');
        updateStatus('Network Error', 'Check connection');
    };

    xhr.send();
}

function displayResults(data) {
    log('Displaying results for analysis ID: ' + data.id);

    var resultsDiv = document.getElementById('results');
    var html = '<h3>🔍 Analysis Results</h3>';

    if (data.image && data.image.path) {
        html +=
            '<div><img src="' +
            data.image.path +
            '" alt="Food Image" class="food-image" onload="log(\'Image loaded: ' +
            data.image.path +
            '\')" onerror="log(\'Image failed to load: ' +
            data.image.path +
            '\')"></div>';
    }

    html += '<p><strong>Food:</strong> ' + data.analysis.foodType + '</p>';
    html += '<p><strong>Weight:</strong> ' + data.weight + 'g</p>';
    html +=
        '<p><strong>Confidence:</strong> ' +
        (data.analysis.confidence * 100).toFixed(1) +
        '%</p>';
    html +=
        '<p><strong>Image File:</strong> ' + data.image.originalName + '</p>';

    html += '<div class="nutrition">';
    html +=
        '<div><strong>' +
        data.analysis.nutrition.calories +
        '</strong><br>Calories</div>';
    html +=
        '<div><strong>' +
        data.analysis.nutrition.protein +
        'g</strong><br>Protein</div>';
    html +=
        '<div><strong>' +
        data.analysis.nutrition.carbs +
        'g</strong><br>Carbs</div>';
    html +=
        '<div><strong>' +
        data.analysis.nutrition.fat +
        'g</strong><br>Fat</div>';
    html +=
        '<div><strong>' +
        data.analysis.nutrition.fiber +
        'g</strong><br>Fiber</div>';
    html += '</div>';

    resultsDiv.innerHTML = html;
    resultsDiv.style.display = 'block';

    updateStatus(
        'Analysis Complete',
        'Last: ' + new Date(data.timestamp).toLocaleString()
    );

    // Hide results after 30 seconds
    setTimeout(function () {
        resultsDiv.style.display = 'none';
        updateStatus('Ready for Next Analysis', 'Waiting...');
        log('Results hidden after 30 seconds');
    }, 30000);
}

// Start the system
log('Food Analysis System starting...');
updateStatus('System Ready', 'Loaded at ' + new Date().toLocaleTimeString());

// Start polling every 2 seconds
log('Starting polling every 2 seconds...');
setInterval(checkForData, 2000);

// Check immediately
checkForData();
