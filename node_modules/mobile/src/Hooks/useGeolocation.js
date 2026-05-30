import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [coordinates, setCoordinates] = useState({ lat: 4.7110, lng: -74.0721 }); // Bogotá por defecto
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("La geolocalización no es soportada por este navegador/dispositivo.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (err) => {
        console.warn("Error leyendo GPS nativo. Simulando coordenadas en Colombia:", err.message);
        // Simulamos coordenadas de envío realistas en Cali o Bogotá
        const mockCoords = [
          { lat: 3.4516, lng: -76.5320 }, // Cali
          { lat: 4.7110, lng: -74.0721 }, // Bogotá
          { lat: 6.2442, lng: -75.5812 }  // Medellín
        ];
        const randomCoord = mockCoords[Math.floor(Math.random() * mockCoords.length)];
        setCoordinates(randomCoord);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return { coordinates, error, loading, refreshLocation: fetchLocation };
};
