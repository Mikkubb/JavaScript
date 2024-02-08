document.addEventListener("DOMContentLoaded", function () { //Kod zostanie wykonany gdy struktura HTML będzie gotowa
//Pobranie elementów z formularza i kontenerów z dokumentu HTML
const addLocationForm = document.getElementById("addLocation");
const weatherContainer = document.getElementById("weatherContainer");
const noteContainer = document.getElementById("noteContainer");

//Rejestrowanie formularza od dodawania lokalizacji
addLocationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    //Pobranie wartości wprowadzonej lokalizacji z formularza
    const locationInput = addLocationForm.querySelector(".location").value;

    //Sprawdzenie, czy wprowadzona wartość nie jest liczbą
    if (!isNaN(locationInput)) {
        showAlert("Please enter a valid city name.");
        return;
    }

    //Pobieranie zapisanych lokalizacji z localStorage
    const savedLocations = getSavedLocations();

    //Sprawdzenie, czy można dodać nową lokalizację
    if (savedLocations.length < 10 && !savedLocations.includes(locationInput)) {
        //Pobranie danych o pogodzie dla wprowadzonej lokalizacji
        fetchWeatherData(locationInput);
        //Zresetowanie formularza
        addLocationForm.reset();
    } else {
        showAlert("You can add up to 10 unique locations, or the location is already added.");
    }
});

//Funkcja pobierająca zapisane lokalizacje z localStorage
function getSavedLocations() {
    return JSON.parse(localStorage.getItem("savedLocations")) || [];
}

//Funkcja pobierająca dane o pogodzie dla danej lokalizacji z serwera
async function fetchWeatherData(location) {
    const apiKey = '4637a8c7d4265eef0b2faba035f67ad3';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    try {
    //Wysłanie zapytania do API pogodowego
    const response = await fetch(apiUrl);
            
    //Sprawdzenie, czy odpowiedź jest poprawna
    if (!response.ok) {
        throw new Error('Weather data not available for the provided location');
    }

    //Parsowanie odpowiedzi do formatu JSON
    const data = await response.json();
            
    //Utworzenie obiektu z danymi o pogodzie
    const weatherData = {
        id: location,
        temperature: Math.floor(data.main.temp),
        humidity: data.main.humidity,
        icon: data.weather[0].icon,
        description: data.weather[0].description,
        city: data.name,
    };

    //Wywołanie funkcji do utworzenia notatki o pogodzie i zapisu lokalizacji
    createWeatherNote(weatherData);
    saveLocation(weatherData);
    } catch (error) {
        //Obsługa błędów podczas pobierania danych o pogodzie
        console.error('Error fetching weather data:', error.message);
        showAlert('Weather data not available for the provided location. Please check the city name and try again.');
    }
}

//Funkcja wyświetlająca alert z podanym komunikatem
function showAlert(message) {
    alert(message);
}

//Funkcja tworząca notatkę o pogodzie i dodająca ją do widoku
function createWeatherNote(weatherData) {
    const note = document.createElement("div");
    note.classList.add("note");

    //Ustawienie HTML dla notatki
    note.innerHTML = `
        <h3>${weatherData.city}</h3>
        <p><span class="bld">Temperature:</span> ${weatherData.temperature}°C</p>
        <p><span class="bld">Humidity:</span> ${weatherData.humidity}%</p>
        <p><span class="bld">Description:</span> ${weatherData.description}</p>
    `;

    //Dodanie ikony pogody do notatki
    const weatherIcon = document.createElement("img");
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.icon}.png`;
    weatherIcon.alt = "Weather Icon";
    note.appendChild(weatherIcon);

    //Dodanie przycisku do usuwania lokalizacji z notatki
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("deleteBtn");
    deleteButton.addEventListener("click", function () {
        deleteLocation(weatherData.id);
        note.remove();
    });

    //Dodanie przycisku do notatki
    note.appendChild(deleteButton);

    //Dodanie notatki do widoku
    noteContainer.appendChild(note);
}

//Funkcja zapisująca lokalizację do localStorage
function saveLocation(weatherData) {
    let savedLocations = getSavedLocations();
        
    //Sprawdzenie, czy można dodać nową lokalizację
    if (savedLocations.length < 10 && !savedLocations.includes(weatherData.id)) {
        savedLocations.push(weatherData.id);
        localStorage.setItem("savedLocations", JSON.stringify(savedLocations));
        localStorage.setItem(weatherData.id, JSON.stringify(weatherData));
    }
}

//Funkcja usuwająca lokalizację z localStorage
function deleteLocation(id) {
    let savedLocations = getSavedLocations();
    const index = savedLocations.indexOf(id);
        
    //Usunięcie lokalizacji z listy
    if (index !== -1) {
        savedLocations.splice(index, 1);
        localStorage.setItem("savedLocations", JSON.stringify(savedLocations));
    }

    //Usunięcie danych o pogodzie dla danej lokalizacji
    localStorage.removeItem(id);
}

//Funkcja czyszcząca stronę
function clearPage() {
    weatherContainer.innerHTML = "";
    noteContainer.innerHTML = "";
}

//Funkcja wczytująca zapisane lokalizacje po załadowaniu strony
async function loadSavedLocations() {
    let savedLocations = getSavedLocations();
        
    //Wyczyszczenie strony przed załadowaniem nowych lokalizacji
    clearPage();

    //Pobranie danych o pogodzie dla każdej zapisanej lokalizacji
    for (const location of savedLocations) {
        await fetchWeatherData(location);
    }
}

//Wywołanie funkcji wczytującej zapisane lokalizacje po załadowaniu strony
loadSavedLocations();

});