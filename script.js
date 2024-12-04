let selectedLocation = {
    current: null,
    destination: null
};

let map; 


const daysWithHighDemand = getRandomHighDemandDays();


function getRandomHighDemandDays() {
    const allDays = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const randomDays = [];
    while (randomDays.length < 3) {
        const randomIndex = Math.floor(Math.random() * allDays.length);
        const day = allDays[randomIndex];
        if (!randomDays.includes(day)) {
            randomDays.push(day);
        }
    }
    return randomDays;
}


function fetchSuggestions(type) {
    const query = document.getElementById(type === 'current' ? 'current-location' : 'destination').value;
    
    if (!query || query.length < 3) { 
        clearSuggestions(type);
        return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${query}, Luanda, Angola`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const suggestionsDiv = document.getElementById(type === 'current' ? 'suggestions-current' : 'suggestions-destination');
            clearSuggestions(type);
            
            if (data.length > 0) {
                data.forEach(item => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.innerText = item.display_name;
                    suggestionItem.onclick = () => selectLocation(item, type);
                    suggestionsDiv.appendChild(suggestionItem);
                });
            }
        })
        .catch(error => console.error('Error fetching suggestions:', error));
}


function selectLocation(item, type) {
    selectedLocation[type] = { lat: item.lat, lng: item.lon };

    
    document.getElementById(type === 'current' ? 'current-location' : 'destination').value = item.display_name;


    clearSuggestions(type);

    calculatePrice();
}


function clearSuggestions(type) {
    const suggestionsDiv = document.getElementById(type === 'current' ? 'suggestions-current' : 'suggestions-destination');
    suggestionsDiv.innerHTML = '';
}


async function calculatePrice() {
    const priceInput = document.getElementById('price');
    
    
    if (!selectedLocation.current || !selectedLocation.destination) {
        priceInput.value = "Defina ambos os locais";
        return;
    }

    
    const distance = Math.random() * 20 + 5; 
    let basePrice = 3000; 

    
    const today = new Date();
    const dayOfWeek = today.toLocaleString('pt-BR', { weekday: 'long' });

    let priceMultiplier = 1;

    
    if (daysWithHighDemand.includes(dayOfWeek.toLowerCase())) {
        priceMultiplier += 0.25;
    }

    
    const currentHour = today.getHours();
    if (currentHour >= 18 || currentHour < 6) {
        priceMultiplier += 0.30;
    }

    
    const finalPrice = basePrice + (distance * 200); 
    const totalPrice = finalPrice * priceMultiplier;

    
    priceInput.value = totalPrice.toFixed(2) + ' AKZ';
}
