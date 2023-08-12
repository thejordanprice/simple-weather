document.addEventListener('DOMContentLoaded', function() {
    const getWeatherButton = document.getElementById('getWeatherButton');
    const weatherOutput = document.getElementById('weatherOutput');
    const zipInput = document.getElementById('zipInput');

    getWeatherButton.addEventListener('click', function() {
        const inputZip = zipInput.value.trim();

        // Load the formatted_data.json file asynchronously
        fetch('formatted_data.json')
            .then(response => response.json())
            .then(formattedData => {
                const location = formattedData.find(item => item.zipCode === inputZip);
                if (location) {
                    const { latitude, longitude } = location;
                    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode_1h`;

                    fetch(weatherUrl)
                        .then(response => response.json())
                        .then(data => {
                            const temperature = data.hourly.temperature_2m[0].value;
                            const weatherDescription = data.hourly.weathercode_1h[0].value;
                            weatherOutput.innerHTML = `Temperature in ${inputZip}: ${temperature}°C<br>Weather: ${weatherDescription}`;
                        })
                        .catch(error => {
                            console.error('Error fetching weather data:', error);
                            weatherOutput.innerHTML = 'Error fetching weather data.';
                        });
                } else {
                    weatherOutput.innerHTML = 'Invalid or unsupported ZIP Code.';
                }
            })
            .catch(error => {
                console.error('Error loading or processing formatted_data.json:', error);
                weatherOutput.innerHTML = 'Error loading or processing data.';
            });
    });
});
