import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

function MapComponent({ position, setPosition, setFormData }) {
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const [address, setAddress] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [street, setStreet] = useState('');
  
  const getAddressFromCoordinates = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const formattedAddress = results[0].formatted_address;
        const placeId = results[0].place_id;
        
        setAddress(formattedAddress);
        if (inputRef.current) {
          inputRef.current.value = formattedAddress;
        }
        
        // Update parent component with address and place_id
        setFormData(prev => ({
          ...prev,
          address: {
            location: formattedAddress,
            street: street,
            place_id: placeId
          }
        }));
      } else {
        setAddress('Address not found');
      }
    });
  };

  useEffect(() => {
    if (isMapLoaded && position.lat && position.lng) {
      getAddressFromCoordinates(position.lat, position.lng);
    }
  }, [position, isMapLoaded]);

  useEffect(() => {
    if (navigator.geolocation && isMapLoaded) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setPosition(coords);
          getAddressFromCoordinates(coords.lat, coords.lng);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }
  }, [isMapLoaded]);

  const handleMapClick = (e) => {
    const newCoords = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setPosition(newCoords);
  };

  const handleMarkerDragEnd = (e) => {
    const newCoords = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setPosition(newCoords);
  };

  const onLoadAutocomplete = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const newCoords = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setPosition(newCoords);
        
        // Update parent component with address and place_id
        setFormData(prev => ({
          ...prev,
          address: {
            location: place.formatted_address || '',
            place_id: place.place_id || ''
          }
        }));
      }
    }
  };

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  const handleStreetChange =(e)=>{
    const newStreet = e.target.value;
    setStreet(newStreet);
    setFormData((prevState)=>({
        ...prevState,
        address:{
            ...prevState.address,
            street:newStreet
        }
    }))
  }

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyC8dQaD5ZNlJnsPydXHDpJLv7usOU1LM_Q"
      libraries={['places']}
    >
      <div className="mb-4">
        <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Search Location"
            ref={inputRef}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </Autocomplete>
      </div>

      <div className="mb-4">
        <input
          type="text"
          name="street"
          placeholder="Extra Info (Landmark, Floor, etc)"
          value={street}
          onChange={handleStreetChange}
          className="w-full p-2 border border-gray-300 rounded"
          maxLength={50}
        />
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={14}
        onClick={handleMapClick}
        onLoad={handleMapLoad}
      >
        <Marker
          position={position}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap>

      <div className="mt-4 p-3 bg-gray-100 border rounded">
        <strong>Address from Map:</strong><br />
        {address || 'Loading address...'}
        <br />
        <strong>Extra Info:</strong> {street}
      </div>
    </LoadScript>
  );
}

export default MapComponent;