import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import shp from "shpjs";
import shpwrite from "shp-write";

// IMPORT SA MGA CSS
import "../styles/MapStyle.css";
import "../styles/SearchBarStyle.css";
import "../styles/BaseMapStyle.css";
import "../styles/AddFileStyle.css";
import "../styles/DrawStyle.css";

import features from "../sample_data/data.json";
import counties from "../sample_data/newcountes.json";


// IMPORT SA MGA ICONS
import { FaPlus, FaMinus, FaRegSquare } from "react-icons/fa6";
import { FaSearch, FaLayerGroup, FaRegCircle } from "react-icons/fa";
import { BiShapePolygon } from "react-icons/bi";
import { PiLineSegmentDuotone } from "react-icons/pi";

// CUSTOM ICON HERE BRUH
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// MOCK DATA FOR NOW
const countyStyle = { weight: 1, color: "black", fillOpacity: 0 };
const featuresStyle = {
  fillColor: "green",
  color: "green",
  weight: 1,
  fillOpacity: 0.5,
};

const onEachFeature = (country, layer) => {
  const props = country.properties;
  layer.bindPopup(`
    Area Name: ${props.AREANAME} <br />
    Perimeter: ${props.PERIMETER} <br />
    Size: ${props.SIZE} <br />
    Year Est: ${props.YEAR} <br />
    Longitude: ${props.LON} <br />
    Latitude: ${props.LAT} <br />
    Country Name: ${props.CNTRYNAME} <br />
    Type: ${props.DESIGNATE} <br />
    Area: ${props.AREA} <br />
  `);
};

// ZOOM CONTROLS
const CustomZoomControl = () => {
  const map = useMap();
  return (
    <div className="custom-zoom-controls">
      <button
        className="zoom-button"
        onClick={() => map.setZoom(map.getZoom() + 1)}
      >
        <FaPlus size={25} color="black" />
      </button>
      <button
        className="zoom-button"
        onClick={() => map.setZoom(map.getZoom() - 1)}
      >
        <FaMinus size={25} color="black" />
      </button>
    </div>
  );
};

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search location..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <FaSearch
      style={{ marginLeft: "10px", color: "#555", marginRight: "10px" }}
    />
  </div>
);

const position = [8.509989, 124.607638];







const MapComponent = () => {
  // NAA DRI TANAN FUNCTIONALITIES SA MAP
  const [searchTerm, setSearchTerm] = useState("");
  const [mapType, setMapType] = useState("standard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);
  const [drawnFeatures, setDrawnFeatures] = useState([]);
  const mapRef = useRef();

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;


    // DRI NGA CODE ANG MAG DRAWING SA LEAFLET
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawPolygon = (shapeType) => {
      const drawOptions = {
        shapeOptions: { color: "blue" },
      };

      let drawHandler;
      if (shapeType === "polygon") drawHandler = new L.Draw.Polygon(map, drawOptions);
      if (shapeType === "rectangle") drawHandler = new L.Draw.Rectangle(map, drawOptions);
      if (shapeType === "circle") drawHandler = new L.Draw.Circle(map, drawOptions);
      if (shapeType === "polyline") drawHandler = new L.Draw.Polyline(map, drawOptions);

      drawHandler.enable();

      map.on("draw:created", (e) => {
        drawnItems.addLayer(e.layer);
        setDrawnFeatures((prev) => [...prev, e.layer.toGeoJSON()]);
        drawHandler.disable();
      });
    };

    // Attach function to window for button click
    window.drawPolygon = drawPolygon;
  }, []);



  // DRI MO SAVE OG FILES
  const saveGeoJSON = () => {
    const geojsonData = { type: "FeatureCollection", features: drawnFeatures };
    const blob = new Blob([JSON.stringify(geojsonData)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drawn_features.geojson";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const saveSHP = () => {
    if (drawnFeatures.length === 0) {
      alert("No features to save.");
      return;
    }

    const geojsonData = { type: "FeatureCollection", features: drawnFeatures };
    shpwrite.download(geojsonData, { folder: "shapefiles", types: { polygon: "polygons" } });
  };
  

  // DRI MO MAKA UPLOAD OG FILES
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        if (file.name.endsWith(".geojson")) {
          const geojsonData = JSON.parse(e.target.result);
          console.log("GeoJSON Data:", geojsonData);
          setUploadedData(geojsonData);
        } else if (file.name.endsWith(".zip")) {
          const geojson = await shp(e.target.result);
          console.log("Converted GeoJSON:", geojson);
          setUploadedData(geojson);
        } else {
          alert("Invalid file format! Please upload a .geojson or .zip file.");
        }
      } catch (error) {
        console.error("Error parsing file:", error);
      }
    };

    file.name.endsWith(".zip")
      ? reader.readAsArrayBuffer(file)
      : reader.readAsText(file);
  };

  

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {/* MAO NI ANG SEARCH BAR */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

    <div className="drawing-buttons-container">
      <div className="drawing-buttons">
        <button className="drawing-buttons-content" onClick={() => window.drawPolygon("polygon")}><BiShapePolygon size={25}/></button>
        <button className="drawing-buttons-content" onClick={() => window.drawPolygon("rectangle")}><FaRegSquare size={25}/></button>
        <button className="drawing-buttons-content" onClick={() => window.drawPolygon("circle")}><FaRegCircle size={25}/></button>
        <button className="drawing-buttons-content" onClick={() => window.drawPolygon("polyline")}><PiLineSegmentDuotone size={25}/></button>
      </div>
    </div>  

      {/* MAO NI ANG BUTTON PARA SA DROPDOWN*/}
      <div className={`dropdown ${dropdownOpen ? "open" : ""}`}>
        <button
          className="dropdown-button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <FaLayerGroup size={25} color={dropdownOpen ? "#4CAF50" : "black"} />
        </button>
        <div className="dropdown-content">
          <a
            href="#"
            onClick={() => setMapType("standard")}
            className={mapType === "standard" ? "active" : ""}
          >
            Standard
          </a>
          <a
            href="#"
            onClick={() => setMapType("satellite")}
            className={mapType === "satellite" ? "active" : ""}
          >
            Satellite
          </a>
        </div>
      </div>

      {/* MAO NI ANG BUTTON PARA SA KUNG MAG UPLOAD MO OG FILES */}
      <div
        style={{
          position: "absolute",
          bottom: "60px",
          left: "40px",
          zIndex: 1000,
        }}
      >
        <input
          type="file"
          accept=".geojson,.zip"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id="fileUpload"
        />
        <label htmlFor="fileUpload" className="upload-button">
          Add file.
        </label>
      </div>

      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          key={mapType}
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          url={
            mapType === "standard"
              ? "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              : "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          }
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />

        <Marker position={position} icon={customIcon}>
          <Popup>Custom marker with an image! 🐾</Popup>
        </Marker>

        {/* naa dri ang mga mock data from GeoJson */}
        <GeoJSON data={counties} style={countyStyle} />
        <GeoJSON
          data={features}
          style={featuresStyle}
          onEachFeature={onEachFeature}
        />

        {/* official data pero dli pa mugana kay kulang pa og functions */}
        {uploadedData && (
          <GeoJSON data={uploadedData} style={{ color: "blue" }} />
        )}

        <CustomZoomControl />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
