import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import features from "../sample_data/data.json";
import counties from "../sample_data/newcountes.json";

// counties styles
const countyStyle = {
  weight: 1,
  color: "black",
  fillOpacity: 0,
  zoom: 0,
};

// features styles
const featuressStyle = {
  fillColor: "green",
  weight: 1,
  color: "green",
  zIndex: 1,
};

const onEachFeature = (country, layer) => {
  layer.options.fillColor = country.properties.color;
		const Area_Name = country.properties.AREANAME;
		const Perimeter = country.properties.PERIMETER;
		const Size = country.properties.SIZE;
		const Year_Est = country.properties.YEAR;
		const Longitude = country.properties.LON;
		const Latitude = country.properties.LAT;
		const Country_Name = country.properties.CNTRYNAME;
		const Type = country.properties.DESIGNATE;
		const Area = country.properties.AREA;

		layer.bindPopup(`
			Area_Name: ${Area_Name} <br />
			Perimeter: ${Perimeter} <br />
			Size: ${Size} <br />
			Year_Est: ${Year_Est} <br />
			Longitude: ${Longitude} <br />
			Latitude: ${Latitude} <br />
			Country_Name: ${Country_Name} <br />
			Type: ${Type} <br />
			Area: ${Area} <br />
			`)

    }

// Define the custom icon
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png", // Custom icon URL
  iconSize: [40, 40], // Icon size
  iconAnchor: [20, 40], // Point of the icon that will be at the marker position
  popupAnchor: [0, -40], // Where the popup will be shown relative to the icon
});

const position = [51.505, -0.09];

const MapComponent = () => {
  const mapRef = useRef();

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={customIcon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>

      <GeoJSON data={counties} styles={countyStyle} />
      <GeoJSON data={features} styles={featuressStyle} onEachFeature={onEachFeature}/>
    </MapContainer>
  );
};

export default MapComponent;
