import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Typography, Chip, Slider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import api from '../services/api';

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    html: `<svg viewBox="0 0 24 24" width="32" height="32" fill="${color}" stroke="#fff" stroke-width="2">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const MapFilters = ({ mapRef, filters, setFilters }) => {
  const map = useMap();
  
  const handlePeriodChange = (period) => {
    const newFilters = { ...filters, historicalPeriod: period };
    setFilters(newFilters);
    mapRef.current.flyTo(map.getCenter(), map.getZoom(), { duration: 0.5 });
  };

  const handleRadiusChange = (e, value) => {
    setFilters({ ...filters, radius: value });
  };

  return (
    <Box sx={{
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1000,
      bgcolor: 'background.paper',
      p: 2,
      borderRadius: 2,
      boxShadow: 3,
      width: 300
    }}>
      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <FilterAltIcon sx={{ mr: 1 }} /> Map Filters
      </Typography>
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Historical Period</InputLabel>
        <Select
          value={filters.historicalPeriod}
          onChange={(e) => handlePeriodChange(e.target.value)}
          label="Historical Period"
        >
          <MenuItem value="all">All Periods</MenuItem>
          <MenuItem value="Ancient">Ancient</MenuItem>
          <MenuItem value="Medieval">Medieval</MenuItem>
          <MenuItem value="Colonial">Colonial</MenuItem>
          <MenuItem value="Modern">Modern</MenuItem>
        </Select>
      </FormControl>
      
      <Typography gutterBottom>Search Radius: {filters.radius} km</Typography>
      <Slider
        value={filters.radius}
        onChange={handleRadiusChange}
        min={1}
        max={100}
        valueLabelDisplay="auto"
      />
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption">Categories:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {['Temple', 'Fort', 'Natural', 'Monument'].map((cat) => (
            <Chip
              key={cat}
              label={cat}
              clickable
              color={filters.categories.includes(cat) ? 'primary' : 'default'}
              onClick={() => {
                const newCategories = filters.categories.includes(cat)
                  ? filters.categories.filter(c => c !== cat)
                  : [...filters.categories, cat];
                setFilters({ ...filters, categories: newCategories });
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default function CulturalMap({ onSiteSelect }) {
  const [sites, setSites] = useState([]);
  const [filters, setFilters] = useState({
    historicalPeriod: 'all',
    radius: 50,
    categories: []
  });
  const mapRef = useRef();
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user location if permitted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log('Geolocation error:', error)
      );
    }

    const fetchSites = async () => {
      try {
        const params = {};
        if (filters.historicalPeriod !== 'all') {
          params.period = filters.historicalPeriod;
        }
        if (filters.categories.length > 0) {
          params.category = filters.categories.join(',');
        }
        
        const response = await api.get('/api/sites', { params });
        setSites(response.data);
      } catch (error) {
        console.error('Error fetching sites:', error);
      }
    };
    
    fetchSites();
  }, [filters]);

  const getMarkerColor = (significance) => {
    switch(significance) {
      case 'UNESCO': return '#ff5722';
      case 'National': return '#4caf50';
      case 'Regional': return '#2196f3';
      default: return '#9e9e9e';
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '70vh', width: '100%', borderRadius: 2, overflow: 'hidden' }}>
      <MapContainer 
        center={userLocation || [7.8731, 80.7718]} 
        zoom={8} 
        style={{ height: '100%', width: '100%' }}
        whenCreated={map => mapRef.current = map}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={createCustomIcon('#9c27b0')}
          >
            <Popup>Your Location</Popup>
          </Marker>
        )}
        
        {sites.map((site) => (
          <Marker
            key={site._id}
            position={[site.location.coordinates[1], site.location.coordinates[0]]}
            icon={createCustomIcon(getMarkerColor(site.significance))}
            eventHandlers={{
              click: () => onSiteSelect(site),
            }}
          >
            <Popup>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="subtitle1">{site.name}</Typography>
                <Typography variant="caption" display="block">
                  {site.historicalPeriod} • {site.significance}
                </Typography>
                {site.categories.map(cat => (
                  <Chip key={cat} label={cat} size="small" sx={{ mr: 0.5, mt: 0.5 }} />
                ))}
              </Box>
            </Popup>
          </Marker>
        ))}
        
        <MapFilters mapRef={mapRef} filters={filters} setFilters={setFilters} />
      </MapContainer>
    </Box>
  );
}