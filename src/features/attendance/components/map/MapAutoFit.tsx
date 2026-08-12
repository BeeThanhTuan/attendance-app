import { useEffect } from "react";
import {
  useMap,
} from "react-leaflet";
import {
  LatLngBounds,
} from "leaflet";

interface Props {
  workplace: {
    latitude: number;
    longitude: number;
  };

  currentPosition: {
    latitude: number;
    longitude: number;
  } | null;
}

export default function MapAutoFit({
  workplace,
  currentPosition,
}: Props) {
  const map = useMap();

  useEffect(() => {
    const points = [
      [
        workplace.latitude,
        workplace.longitude,
      ] as [number, number],
    ];

    if (currentPosition) {
      points.push([
        currentPosition.latitude,
        currentPosition.longitude,
      ]);
    }

    const bounds = new LatLngBounds(points);

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 17,
    });
  }, [
    map,
    workplace.latitude,
    workplace.longitude,
    currentPosition?.latitude,
    currentPosition?.longitude,
  ]);

  return null;
}