import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';

// Fix default marker issue in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapResults = ({ results = [] }) => {
  if (!Array.isArray(results) || results.length === 0) {
    return (
      <p className="mt-4 text-gray-600">No optimized sites to display yet.</p>
    );
  }

  const center = [results[0].latitude, results[0].longitude];

  // Prepare heatmap points: [lat, lon, intensity]
  const heatmapPoints = results.map((site) => [
    site.latitude,
    site.longitude,
    site.fitness || 0.5,
  ]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Optimized Site Locations</h3>
      <MapContainer
        center={center}
        zoom={7.5}
        scrollWheelZoom={false}
        style={{ height: "450px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Heatmap Layer based on fitness */}
        <HeatmapLayer
          fitBoundsOnLoad
          fitBoundsOnUpdate
          points={heatmapPoints}
          longitudeExtractor={(m) => m[1]}
          latitudeExtractor={(m) => m[0]}
          intensityExtractor={(m) => m[2]}
          radius={20}
          blur={25}
          max={1}
        />

        {/* Marker Layer */}
        {results.map((site, idx) => (
          <Marker key={idx} position={[site.latitude, site.longitude]}>
            <Popup>
              <strong>Site #{idx + 1}</strong>
              <br />
              Irradiance: {site.solar_irradiance} kWh/m²/day
              <br />
              Land Cost: ₹{site.land_cost} /sq.ft
              <br />
              Distance to Infra: {site.distance_to_infra} km
              <br />
              Fitness: {site.fitness}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapResults;
