import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

function PropertyMap({ location, title }) {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your API key
        version: 'weekly',
      });

      try {
        const google = await loader.load();
        
        // For demo purposes, using a default location if geocoding is not available
        const defaultPosition = { lat: 40.7128, lng: -74.0060 }; // New York City

        const map = new google.maps.Map(mapRef.current, {
          center: defaultPosition,
          zoom: 15,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#242f3e" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#242f3e" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#746855" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }]
            }
          ],
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: true,
          rotateControl: true,
          fullscreenControl: true
        });

        googleMapRef.current = map;

        // Create a marker
        const marker = new google.maps.Marker({
          position: defaultPosition,
          map: map,
          title: title,
          animation: google.maps.Animation.DROP
        });

        markerRef.current = marker;

        // Create an info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold">${title}</h3>
              <p class="text-sm text-gray-600">${location}</p>
            </div>
          `
        });

        // Add click listener to marker
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        // Try to geocode the location
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: location }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const position = results[0].geometry.location;
            map.setCenter(position);
            marker.setPosition(position);
          }
        });

      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [location, title]);

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

export default PropertyMap;