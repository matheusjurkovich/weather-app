"use client";
import { useState, useEffect } from "react";
import Main from "@/components/main";
import Nav from "@/components/nav";

interface Location {
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Erro ao obter a localização:", error);
      }
    );
  }, []);

  return (
    <div>
      <Nav />
      {location && (
        <Main
          latitude={location.latitude}
          longitude={location.longitude}
        />
      )}
    </div>
  );
}
