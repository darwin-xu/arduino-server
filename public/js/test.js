console.log('Test page loaded');

async function testAPI() {
    try {
        console.log('Testing API...');
        const response = await fetch('/api/latest-analysis');
        const data = await response.json();
        console.log('API Response:', data);

        document.getElementById('output').innerHTML =
            '<pre>' + JSON.stringify(data, null, 2) + '</pre>';

        if (data.success && data.data && data.data.image) {
            document.getElementById('output').innerHTML +=
                '<br><img src="' +
                data.data.image.path +
                '" style="max-width: 200px;" alt="Food Image">';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('output').innerHTML = 'Error: ' + error.message;
    }
}

// Test immediately and then every 3 seconds
testAPI();
setInterval(testAPI, 3000);
