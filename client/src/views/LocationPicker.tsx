import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon } from 'mdb-react-ui-kit';
import '../styles/location-picker.css';

// Note: In a real implementation, you would use @react-google-maps/api or similar library.
// This is a UI mockup demonstrating the required design and interactions.
const LocationPicker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [address, setAddress] = useState('123 Civic Center Plaza, Springfield');
  const [coordinates, setCoordinates] = useState('40.7128° N, 74.0060° W');
  const [isDragging, setIsDragging] = useState(false);
  const [markerDropped, setMarkerDropped] = useState(true);

  // Mock handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleMapClick = () => {
    setMarkerDropped(false);
    setTimeout(() => setMarkerDropped(true), 100);
    // In real app, update coordinates based on click event
    setCoordinates('40.7135° N, 74.0075° W');
    setAddress('Dropped Pin Location');
  };

  return (
    <MDBContainer fluid className="px-0 location-picker-container bg-light h-100">
      <MDBRow className="m-0 position-relative" style={{ minHeight: '600px', height: '100%' }}>
        {/* Search Box Overlay */}
        <MDBCol md="6" lg="4" className="position-absolute search-box-container z-2 mt-4 ms-md-4 px-3 px-md-0">
          <MDBCard className="shadow-lg border-0 rounded-4">
            <MDBCardBody className="p-2 p-md-3 d-flex align-items-center bg-white rounded-4">
              <MDBIcon fas icon="search" className="text-muted ms-2 me-3" size="lg" />
              <input
                type="text"
                className="form-control border-0 shadow-none bg-transparent flex-grow-1 map-search-input"
                placeholder="Search location..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ fontSize: '1.1rem', outline: 'none' }}
              />
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
          <MDBCard className="shadow-sm border-0 rounded-4 mt-3 info-box fade-in bg-white">
            <MDBCardBody className="p-3">
              <div className="d-flex align-items-start">
                <div className="marker-icon-bg bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 mt-1" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                  <MDBIcon fas icon="map-marker-alt" size="lg" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Selected Location</h6>
                  <p className="text-muted small mb-1">{address}</p>
                  <p className="text-primary small fw-500 mb-0"><MDBIcon fas icon="crosshairs" className="me-1"/> {coordinates}</p>
                </div>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Map Area Mockup */}
        <div className="w-100 h-100 position-absolute top-0 start-0 z-1 map-background p-0 m-0" onClick={handleMapClick}>
          {/* Faint background markers for context */}
          <div className="position-absolute faint-marker" style={{ top: '30%', left: '40%' }}>
            <MDBIcon fas icon="map-marker" size="2x" style={{ color: 'rgba(2, 136, 209, 0.3)' }} />
          </div>
          <div className="position-absolute faint-marker" style={{ top: '60%', left: '70%' }}>
            <MDBIcon fas icon="map-marker" size="2x" style={{ color: 'rgba(255, 152, 0, 0.3)' }} />
          </div>
          
          {/* Main Interactive Marker */}
          <div 
            className={`position-absolute main-marker d-flex flex-column align-items-center 
              ${isDragging ? 'dragging' : ''} ${markerDropped ? 'dropped pulse' : ''}`}
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -100%)', cursor: 'grab', zIndex: 10 }}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => { setIsDragging(false); setMarkerDropped(true); }}
            onMouseLeave={() => setIsDragging(false)}
          >
            <div className="marker-label bg-white px-2 py-1 rounded shadow-sm mb-1 small fw-bold text-dark w-100 text-center text-nowrap" style={{ opacity: isDragging ? 1 : 0.8 }}>
              {isDragging ? 'Drop to set' : 'Drag me'}
            </div>
            <div className="marker-pin">
               <MDBIcon fas icon="map-marker-alt" size="3x" className="text-warning" style={{ color: '#ff9800', filter: 'drop-shadow(0px 5px 3px rgba(0,0,0,0.4))' }} />
            </div>
            {/* Shadow underneath marker */}
            {!isDragging && <div className="marker-shadow"></div>}
          </div>
          
          {/* Map Controls Mockup */}
          <div className="position-absolute bottom-0 end-0 m-4 z-2 d-flex flex-column gap-2 map-controls">
            <button className="btn btn-light bg-white border-0 shadow-sm p-2 rounded-circle hover-effect d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
              <MDBIcon fas icon="plus" size="lg" className="text-secondary" />
            </button>
            <button className="btn btn-light bg-white border-0 shadow-sm p-2 rounded-circle hover-effect d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
              <MDBIcon fas icon="minus" size="lg" className="text-secondary" />
            </button>
            <button className="btn btn-primary shadow p-2 rounded-circle mt-2 hover-effect d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
              <MDBIcon fas icon="location-arrow" size="lg" />
            </button>
          </div>
        </div>
      </MDBRow>
    </MDBContainer>
  );
};

export default LocationPicker;
