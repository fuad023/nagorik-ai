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
    if (!secrets.googleMapsApiKey) {
      setError('⚠️ Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to your .env file');
      setIsLoading(false);
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${secrets.googleMapsApiKey}&libraries=places&language=en`;
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
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Cleanup if needed
    };
  }, []);

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
                onPlacesChanged={handlePlacesChanged}
              >
                <input
                  type="text"
                  className="form-control border-0 shadow-none bg-transparent flex-grow-1 map-search-input"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: '1.1rem', outline: 'none' }}
                />
              </StandaloneSearchBox>
              {searchQuery && (
                <MDBIcon 
                  fas 
                  icon="times" 
                  className="text-muted ms-2 me-2 cursor-pointer" 
                  onClick={() => setSearchQuery('')}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </MDBCardBody>
          </MDBCard>

          {/* Location Info Box */}
          {address || coordinates ? (
            <MDBCard className="shadow-sm border-0 rounded-4 mt-3 info-box fade-in bg-white">
              <MDBCardBody className="p-3">
                <div className="d-flex align-items-start">
                  <div className="marker-icon-bg bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 mt-1" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                    <MDBIcon fas icon="map-marker-alt" size="lg" />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1 text-dark">Selected Location</h6>
                    <p className="text-muted small mb-1">{address || 'Click on map to set location'}</p>
                    <p className="text-primary small fw-500 mb-2"><MDBIcon fas icon="crosshairs" className="me-1"/> {coordinates}</p>
                    <MDBBtn 
                      size="sm" 
                      color="primary"
                      onClick={handleLocationSubmit}
                      className="py-1"
                    >
                      <MDBIcon fas icon="check" className="me-1" /> Confirm Location
                    </MDBBtn>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          ) : null}
        </MDBCol>

        {/* Google Map */}
        <div style={mapContainerStyle} className="position-absolute top-0 start-0 z-1 p-0 m-0 map-background">
          <GoogleMap
            ref={mapRef}
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={14}
            onClick={handleMapClick}
            options={{
              zoomControl: true,
              fullscreenControl: true,
              streetViewControl: false,
            }}
          >
            <Marker position={markerLocation} />
          </GoogleMap>
        </div>
      </MDBRow>
    </MDBContainer>
  );
};

export default LocationPicker;
