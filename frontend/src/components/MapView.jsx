import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import api from '../services/api';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function MapView({ onSiteSelect }) {
  const [sites, setSites] = useState([]);
  const [center] = useState([7.8731, 80.7718]); // Center of Sri Lanka

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await api.get('/api/sites');
        setSites(response.data);
      } catch (error) {
        console.error('Error fetching sites:', error);
      }
    };
    fetchSites();
  }, []);

  return (
    <div className="map-container" style={{ height: '500px', width: '100%' }}>
      <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {sites.map((site) => (
          <Marker
            key={site._id}
            position={[site.location.coordinates[1], site.location.coordinates[0]]}
            eventHandlers={{
              click: () => onSiteSelect(site),
            }}
          >
            <Popup>
              <h3>{site.name}</h3>
              <p>{site.historicalPeriod} Period</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}