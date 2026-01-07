import { useState, useEffect, useRef, useCallback } from 'react';
import { UserLocation } from '../types';

export enum GeolocationStatus {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  LOCKED = 'LOCKED',
  STALE = 'STALE',
  DENIED = 'DENIED',
  ERROR = 'ERROR'
}

interface UseGeolocationResult {
  location: UserLocation | null;
  error: string | null;
  status: GeolocationStatus;
  refresh: () => void;
}

const STORAGE_KEY = 'tg_last_known_location';

export const useGeolocation = (): UseGeolocationResult => {
  const [location, setLocation] = useState<UserLocation | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>(GeolocationStatus.IDLE);
  const watchId = useRef<number | null>(null);

  const updateLocation = useCallback((pos: GeolocationPosition) => {
    const newLocation: UserLocation = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      heading: pos.coords.heading,
      speed: pos.coords.speed,
      timestamp: pos.timestamp
    };

    // Filter Jitter: Only update if accuracy improves significantly or we moved significantly (>5m)
    setLocation(prev => {
      if (!prev) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
        return newLocation;
      }

      // Simple haversine-lite distance check
      const dLat = (newLocation.lat - prev.lat) * (Math.PI / 180);
      const dLon = (newLocation.lng - prev.lng) * (Math.PI / 180);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(prev.lat * (Math.PI / 180)) * Math.cos(newLocation.lat * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distMeters = 6371e3 * c;

      // Only update state if movement is significant (>5m) or accuracy improved by >20%
      if (distMeters > 5 || newLocation.accuracy < (prev.accuracy * 0.8)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
        return newLocation;
      }
      return prev;
    });

    setStatus(GeolocationStatus.LOCKED);
    setError(null);
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    console.warn("Geolocation Engine Alert:", err.message);
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setError("Location access denied.");
        setStatus(GeolocationStatus.DENIED);
        break;
      case err.POSITION_UNAVAILABLE:
        setError("GPS signal unavailable.");
        setStatus(GeolocationStatus.STALE);
        break;
      case err.TIMEOUT:
        setError("Handshake timed out.");
        setStatus(GeolocationStatus.ERROR);
        break;
      default:
        setError("Unknown positioning failure.");
        setStatus(GeolocationStatus.ERROR);
    }
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation API not supported.");
      setStatus(GeolocationStatus.ERROR);
      return;
    }

    setStatus(GeolocationStatus.SEARCHING);
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0 
    };

    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
    }

    navigator.geolocation.getCurrentPosition(updateLocation, handleError, options);
    watchId.current = navigator.geolocation.watchPosition(updateLocation, handleError, options);
  }, [updateLocation, handleError]);

  useEffect(() => {
    startTracking();
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [startTracking]);

  return { location, error, status, refresh: startTracking };
};
git push
