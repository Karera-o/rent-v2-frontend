"use client";

import { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: true,
  fullscreenControl: true,
};

export default function PropertyMap({ latitude, longitude, title, address }) {
  const [selectedMarker, setSelectedMarker] = useState(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const center = {
    lat: parseFloat(latitude) || -1.9441,  // Default to Rwanda coordinates if not provided
    lng: parseFloat(longitude) || 29.8739,
  };

  const onMapClick = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  if (loadError) return <div className="p-8 text-center text-gray-500">Error loading maps</div>;
  if (!isLoaded) return <div className="p-8 text-center text-gray-500">Loading maps...</div>;

  return (
    <div className="border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <MapPin className="h-5 w-5 text-[#111827] mr-2" />
        <h3 className="text-lg font-light text-[#111827]">Property Location</h3>
      </div>
      
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
        options={options}
        onClick={onMapClick}
      >
        <Marker
          position={center}
          onClick={() => setSelectedMarker({ title, address, position: center })}
        />
        
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h4 className="font-medium text-sm">{selectedMarker.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{selectedMarker.address}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
} 