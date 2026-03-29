import React, { useEffect, useRef, useState } from 'react';
import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import '../styles/location-picker.css';
import { secrets } from '../secrets';

interface LocationPickerProps {
  onLocationSelect?: (location: { address: string; lat: number; lng: number }) => void;
  defaultLocation?: { lat: number; lng: number };
}

declare global {
  interface Window {
    google: any;
    initMapCallback?: () => void;
  }
}

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  onLocationSelect, 
  defaultLocation = { lat: 40.7128, lng: -74.0060 } 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const searchBoxRef = useRef<any>(null);
  
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(`${defaultLocation.lat}°, ${defaultLocation.lng}°`);
  const [markerLocation, setMarkerLocation] = useState(defaultLocation);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Google Maps API script
  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // If no API key, still load the library in demo mode
    const apiKey = secrets.googleMapsApiKey && secrets.googleMapsApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' 
      ? secrets.googleMapsApiKey 
      : null;

    if (!apiKey) {
      // Demo mode - show working UI without real API key
      setIsLoading(false);
      initializeDemoMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=en`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google && window.google.maps) {
        initializeMap();
      }
    };
    
    script.onerror = () => {
      setError('Failed to load Google Maps. Check your API key.');
      setIsLoading(false);
      // Fall back to demo mode
      initializeDemoMap();
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  const initializeDemoMap = () => {
    if (!mapRef.current) return;
    
    // Create a simple demo map using OpenStreetMap tiles or canvas
    const canvas = mapRef.current;
    canvas.style.backgroundColor = '#e0e0e0';
    canvas.innerHTML = `
      <div style="
        width: 100%; 
        height: 100%; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        flex-direction: column;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: Arial, sans-serif;
      ">
        <p style="font-size: 24px; margin: 0 0 10px 0;">🗺️ Map Demo</p>
        <p style="font-size: 14px; margin: 0; opacity: 0.9;">Click on this area or search a location</p>
        <p style="font-size: 12px; margin: 10px 0 0 0; opacity: 0.8;">Add Google Maps API key to enable real maps</p>
      </div>
    `;
    
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Generate random coordinates based on click
      const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
      const lng = -74.0060 + (Math.random() - 0.5) * 0.1;
      
      updateLocation(lat, lng);
    });
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: defaultLocation,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        streetViewControl: false,
      });

      mapInstanceRef.current = map;

      // Create marker
      const marker = new window.google.maps.Marker({
        position: defaultLocation,
        map: map,
        draggable: true,
        title: 'Drag to move or click map',
      });

      markerRef.current = marker;

      // Update location when marker is dragged
      marker.addListener('dragend', () => {
        const lat = marker.getPosition().lat();
        const lng = marker.getPosition().lng();
        updateLocation(lat, lng);
      });

      // Update location when map is clicked
      map.addListener('click', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        marker.setPosition({ lat, lng });
        updateLocation(lat, lng);
      });

      // Setup search box
      const searchInput = document.getElementById('location-search') as HTMLInputElement;
      if (searchInput && window.google.maps.places) {
        searchBoxRef.current = new window.google.maps.places.SearchBox(searchInput);
        
        searchBoxRef.current.addListener('places_changed', () => {
          const places = searchBoxRef.current.getPlaces();
          if (places.length === 0) return;

          const place = places[0];
          if (!place.geometry || !place.geometry.location) return;

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          marker.setPosition({ lat, lng });
          map.panTo({ lat, lng });
          updateLocation(lat, lng);
        });
      }

      setIsLoading(false);
      // Get initial address
      getAddressFromCoordinates(defaultLocation.lat, defaultLocation.lng);
    } catch (err) {
      setError('Error initializing map');
      setIsLoading(false);
    }
  };

  const getAddressFromCoordinates = (lat: number, lng: number) => {
    if (!window.google || !window.google.maps) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
      }
    });
  };

  const updateLocation = (lat: number, lng: number) => {
    setMarkerLocation({ lat, lng });
    setCoordinates(`${lat.toFixed(4)}°, ${lng.toFixed(4)}°`);
    getAddressFromCoordinates(lat, lng);
  };

  const handleConfirmLocation = () => {
    if (address && markerLocation && onLocationSelect) {
      onLocationSelect({
        address,
        lat: markerLocation.lat,
        lng: markerLocation.lng,
      });
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Search Bar */}
      <div style={{ padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ position: 'relative' }}>
          <MDBIcon fas icon="search" style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
          <input
            id="location-search"
            type="text"
            placeholder="Search location..."
            style={{
              width: '100%',
              padding: '10px 10px 10px 40px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Map Container */}
      {isLoading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner-border text-primary" role="status" style={{ marginBottom: '10px' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ color: '#666' }}>Loading map...</p>
          </div>
        </div>
      )}

      {error && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffebee' }}>
          <div style={{ textAlign: 'center', color: '#c62828', padding: '20px' }}>
            <p style={{ marginBottom: '10px' }}>{error}</p>
            <small>For testing, you can add a dummy key or use the mock map.</small>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div 
            ref={mapRef} 
            style={{ flex: 1, width: '100%', minHeight: '300px' }}
          />

          {/* Info Bar */}
          {address && (
            <div style={{ padding: '16px', backgroundColor: '#fff', borderTop: '1px solid #e0e0e0' }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MDBIcon fas icon="map-marker-alt" style={{ color: '#1976d2', fontSize: '20px', marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <h6 style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#333' }}>Selected Location</h6>
                    <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '14px' }}>{address}</p>
                    <small style={{ color: '#999' }}>📍 {coordinates}</small>
                  </div>
                </div>
              </div>
              <MDBBtn 
                onClick={handleConfirmLocation}
                color="primary"
                size="sm"
                style={{ width: '100%' }}
              >
                <MDBIcon fas icon="check" className="me-2" /> Confirm Location
              </MDBBtn>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LocationPicker;
