document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map
    var map = L.map("map").setView([33.3152, 44.3661], 13);

    // Add OpenStreetMap tile layer to the map
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}", {
        foo: "bar",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    var markers = []; // Array to store markers
    var circle = null; // Variable to store circle

    // Function to add marker
    function addMarker(place) {
        const redIcon = L.icon({
            iconUrl: "./assest/location-dot-solid.svg",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

        const marker = L.marker(place.coords, {
            title: place.title,
            icon: redIcon,
        }).bindPopup(
            `<div class="popup">${place.address}<a href="${place.website}" target="_blank">Website</a><br>Call: <a href="tel:${place.phone}">${place.phone}</a></div>`
        );

        marker.addTo(map);
        markers.push(marker); // Add marker to the array
    }

    // Function to add circle to coordinates
    function addCircle(coord) {
        circle = L.circle(coord, {
            color: "#376ecf",
            fillColor: "#5e88d4",
            fillOpacity: 0.5,
            radius: 3000,
        });
        circle.addTo(map);
        map.panTo(coord); // Pan the map to the center of the circle
    }

    // Function to remove markers from the map
    function removeMarkers() {
        markers.forEach((marker) => {
            map.removeLayer(marker);
        });
        markers = []; // Clear the array
    }

    // Function to remove circle from the map
    function removeCircle() {
        if (circle !== null) {
            map.removeLayer(circle);
            circle = null;
        }
    }

    // Function to clear the error message
    function clearErrorMessage() {
        document.getElementById("errorContainer").style.display = "none";
        document.getElementById("errorMessage").textContent = "";
    }

    // Function to fetch data and add markers and circles
    function fetchDataAndAddMarkersAndCircles(city) {
        const url = `http://localhost:3000/${city}`;
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Data not found for ${city}`);
                }
                return response.json();
            })
            .then((data) => {
                clearErrorMessage(); // Clear error message
                removeMarkers(); // Remove previous markers
                removeCircle(); // Remove previous circle

                const places = data.places || [];
                if (places.length > 0) {
                    // If data is available, enable the info div
                    document.querySelector('.info').style.display = 'block';
                    searchButton.disabled = false; // Enable search button
                    places.forEach((place) => {
                        addMarker(place);
                    });

                    // Add circle to the center of the map
                    addCircle(data.coord);

                    // Extract and display popup content in the info div
                    let infoContent = '';
                    markers.forEach((marker, index) => {
                        infoContent += `<div class="info-item" data-index="${index}">${marker.getPopup().getContent()}</div><hr>`;
                    });
                    document.querySelector('.info').innerHTML = infoContent;

                    // Add event listener to info items
                    document.querySelectorAll('.info-item').forEach(item => {
                        item.addEventListener('click', function () {
                            const index = parseInt(item.getAttribute('data-index'));
                            const clickedMarker = markers[index];

                            // Show only the clicked marker
                            markers.forEach(marker => {
                                if (marker === clickedMarker) {
                                    marker.addTo(map);
                                } else {
                                    map.removeLayer(marker);
                                }
                            });

                            // Pan the map to the clicked marker's position
                            map.panTo(clickedMarker.getLatLng());
                        });
                    });
                } else {
                    // If no data is available, disable the info div and search button
                    document.querySelector('.info').style.display = 'none';
                }
            })
            .catch((error) => {
                // Display error message on HTML
                document.getElementById("errorContainer").style.display = "block";
                document.getElementById("errorMessage").textContent = error.message;
                console.error(error.message);

                // Remove previous markers and circle if an error occurs
                removeMarkers();
                removeCircle();

                // Disable info div and search button in case of error
                document.querySelector('.info').style.display = 'none';
            });
    }

    // Add event listener to the search button
    document.getElementById("searchButton").addEventListener("click", function () {
        const searchInput = document.getElementById("searchInput").value.trim();

        if (searchInput !== "") {
            // Call the function to fetch data and add markers and circles
            fetchDataAndAddMarkersAndCircles(searchInput);
        }
    });
});






























/*
document.addEventListener("DOMContentLoaded", function () {
    

    // initialize the map
    var map = L.map("map").setView([33.3152, 44.3661], 13);

    // add OpenStreetMap tile layer to the map
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}", {
        foo: "bar",
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    var markers = []; // array to store markers
    var circle = null; // variable to store circle

    // function to add marker
    function addMarker(place) {
        const redIcon = L.icon({
            iconUrl: "./assest/location-dot-solid.svg",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

        const marker = L.marker(place.coords, {
            title: place.title,
            icon: redIcon,
        }).bindPopup(
            `<div class="popup">${place.address}<a href="${place.website}" target="_blank">Website</a><br>Call: <a href="tel:${place.phone}">${place.phone}</a></div><hr>`
        );

        marker.addTo(map);
        markers.push(marker); // add marker to the array
    }

    // function to add circle to coordinates
    function addCircle(coord) {
        circle = L.circle(coord, {
            color: "#376ecf",
            fillColor: "#5e88d4",
            fillOpacity: 0.5,
            radius: 3000,
        });
        circle.addTo(map);
        map.panTo(coord); // pan the map to the center of the circle
    }

    // function to remove markers from the map
    function removeMarkers() {
        markers.forEach((marker) => {
            map.removeLayer(marker);
        });
        markers = []; // clear the array
    }

    // function to remove circle from the map
    function removeCircle() {
        if (circle !== null) {
            map.removeLayer(circle);
            circle = null;
        }
    }

    // function to clear the error message
    function clearErrorMessage() {
        document.getElementById("errorContainer").style.display = "none";
        document.getElementById("errorMessage").textContent = "";
    }

    // function to fetch data and add markers and circles
    function fetchDataAndAddMarkersAndCircles(city) {
        const url = `http://localhost:3000/${city}`;
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Data not found for ${city}`);
                }
                return response.json();
            })
            .then((data) => {
                clearErrorMessage(); // clear error message
                removeMarkers(); // remove previous markers
                removeCircle(); // remove previous circle

                const places = data.places || [];
                if (places.length > 0) {
                    // If data is available, enable the info div
                    document.querySelector('.info').style.display = 'block';
                    searchButton.disabled = false; // Enable search button
                    places.forEach((place) => {
                        addMarker(place);
                    });

                    // add circle to the center of the map
                    addCircle(data.coord);

                    // Extract and display popup content in the info div
                    let infoContent = '';
                    markers.forEach(marker => {
                        infoContent += marker.getPopup().getContent();
                    });
                    document.querySelector('.info').innerHTML = infoContent;
                } else {
                    // If no data is available, disable the info div and search button
                    document.querySelector('.info').style.display = 'none';
                
                }
            })
            .catch((error) => {
                // display error message on HTML
                document.getElementById("errorContainer").style.display = "block";
                document.getElementById("errorMessage").textContent = error.message;
                console.error(error.message);

                // remove previous markers and circle if an error occurs
                removeMarkers();
                removeCircle();

                // Disable info div and search button in case of error
                document.querySelector('.info').style.display = 'none';
                
            });
    }

    // add event listener to the search button
    document.getElementById("searchButton").addEventListener("click", function () {
        const searchInput = document.getElementById("searchInput").value.trim();

        if (searchInput !== "") {
            // call the function to fetch data and add markers and circles
            fetchDataAndAddMarkersAndCircles(searchInput);
        }
    });
});
*/