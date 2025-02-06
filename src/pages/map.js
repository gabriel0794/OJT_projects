import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png", // Replace with your custom icon URL
    iconSize: [40, 40], // Size of the icon
    iconAnchor: [20, 40], // Point of the icon which corresponds to marker's location
    popupAnchor: [0, -40], // Where the popup should open relative to the icon
  });

const Map = () => {
    useEffect(() => {
        // Any additional setup can be done here
    }, []);

    return (
        <MapContainer center={[8.509989, 124.607638]} zoom={13} scrollWheelZoom={true} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[8.509989, 124.607638]} icon={customIcon}>
        <Popup>
          Custom marker with an image! 🐾
        </Popup>
      </Marker>
    </MapContainer>
    );
};

export default Map;