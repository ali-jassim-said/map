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
            `<span class="popup">${place.address}<br><a href="${place.website}" target="_blank">Website</a><br>Call: <a href="tel:${place.phone}">${place.phone}</a></span>`
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
                places.forEach((place) => {
                    addMarker(place);
                });

                // add circle to the center of the map
                addCircle(data.coord);
            })
            .catch((error) => {
                // display error message on HTML
                document.getElementById("errorContainer").style.display = "block";
                document.getElementById("errorMessage").textContent = error.message;
                console.error(error.message);

                // remove previous markers and circle if an error occurs
                removeMarkers();
                removeCircle();
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


