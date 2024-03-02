import React, { useState, useEffect } from 'react';
import { withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps';

const MapComponent = withGoogleMap(({ directions }) => (
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: 17.375278, lng: 78.474444 }}
    >
        {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
));




const Map = () => {
    const [directions, setDirections] = useState(null);
    const [locations, setLocations] = useState([]);

    const [source, setSource] = useState(null)
    const [destinationLocation, setDestination] = useState(null)




    useEffect(() => {
        getLocations()
    }, [])

    const getLocations = async () => {
        const apiUrl = 'https://gist.githubusercontent.com/dastagirkhan/00a6f6e32425e0944241/raw/33ca4e2b19695b2b93f490848314268ed5519894/gistfile1.json';

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data)
            setLocations(data)
        } catch (error) {
            console.error('Error fetching location data:', error.message);
        }
    }

    const showDirections = () => {
        console.log(source, destinationLocation)
        const directionsService = new window.google.maps.DirectionsService();
        const origin = { lat: parseInt(source.lat), lng: parseInt(source.lon) };
        const destination = { lat: parseInt(destinationLocation.lat), lng: parseInt(destinationLocation.lon) };

        directionsService.route(
            {
                origin,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error(`Error fetching directions: ${status}`);
                }
            }
        );

        const data = {
            sourcename: source.name,
            sourcelat: source.lat,
            sourcelong: source.lon,
            destname: destinationLocation.name,
            destlat: destinationLocation.lat,
            destlong: destinationLocation.lon,
        };

        try {
            const response = fetch('http://localhost:400/insertLocations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // You might need additional headers based on your server requirements
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('Data sent successfully');
            } else {
                console.error('Failed to send data:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSoucreSearch = (sourceLocation) => {
        const sourceL = locations.find(
            (location) =>
                location.name.toLowerCase() === sourceLocation.toLowerCase()
        );
        setSource(sourceL)
    };

    const handleDestSearch = (destLocation) => {
        const destL = locations.find(
            (location) =>
                location.name.toLowerCase() === destLocation.toLowerCase()
        );
        setDestination(destL)

    };

    return (
        <div>
            <input placeholder='Source' onChange={(e) => { handleSoucreSearch(e.target.value) }} />
            <input placeholder='Destination' onChange={(e) => handleDestSearch(e.target.value)} />
            <button onClick={() => showDirections()}>Show Directions</button>
            <MapComponent
                containerElement={<div style={{ height: '400px' }} />}
                mapElement={<div style={{ height: '100%' }} />}
                directions={directions}

            />
        </div>
    );
};

export default Map;