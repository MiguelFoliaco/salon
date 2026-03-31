'use client';
import React, { memo } from 'react'
import { MapContainer, Marker, Polygon, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { Tables } from '@/supabase/database.types';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        try {

            if (center && map?.setView) {
                map.setView(center, map.getZoom());
            }
        }
        catch (err) {
            console.log(err)
        }
    }, [center, map]);
    return null;
}

function MapEventsListener({ onAddPoint, isDrawing }: { onAddPoint: (latlng: [number, number]) => void, isDrawing: boolean }) {
    useMapEvents({
        click(e) {
            if (isDrawing) {
                onAddPoint([e.latlng.lat, e.latlng.lng]);
            }
        },
    });
    return null;
}

export type PolygonData = {
    points: [number, number][];
    color: string;
    branch: Tables<'branches'>;
    value: number;
    id?: string;
}

type Props = {
    position?: [number, number];
    points?: [number, number][];
    polygons?: Record<string, PolygonData>;
    isDrawing?: boolean;
    onAddPoint?: (latlng: [number, number]) => void;
    activeColor?: string;
    onPolygonClick?: (name: string) => void;
}

export const PolygonInput = memo(({
    position,
    points = [],
    polygons = {},
    isDrawing = false,
    onAddPoint,
    activeColor = '#ec4899',
    onPolygonClick
}: Props) => {
    if (!position) return (
        <div className="w-full h-full bg-base-200 animate-pulse rounded-box flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    return (
        <MapContainer
            key="polygon-map-container"
            zoom={13}
            fadeAnimation
            scrollWheelZoom={true}
            center={position}
            className="w-full h-full rounded-box z-0"
        >
            <ChangeView center={position} />
            <MapEventsListener isDrawing={isDrawing} onAddPoint={onAddPoint!} />

            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Current Position Marker */}
            <Marker
                position={position}>
                <Popup>
                    <span className="font-medium">Tu ubicación actual</span>
                </Popup>
            </Marker>

            {/* Render saved polygons */}
            {Object.entries(polygons).map(([key, data]) => (
                <Polygon
                    key={key}
                    positions={data.points}
                    pathOptions={{
                        color: data.color,
                        fillColor: data.color,
                        fillOpacity: 0.25,
                        weight: 2
                    }}
                    eventHandlers={{
                        click: () => onPolygonClick?.(key)
                    }}
                >
                    <Popup>
                        <div className="text-sm">
                            <p className="font-bold">{key}</p>
                            <p>Valor: ${data.value.toLocaleString()}</p>
                        </div>
                    </Popup>
                </Polygon>
            ))}

            {/* Polygon Points Markers (Active Drawing) */}
            {points.map((p, i) => (
                <Marker key={i} position={p}>
                    <Popup>Punto {i + 1}</Popup>
                </Marker>
            ))}

            {/* The Active Polygon itself */}
            {points.length > 2 && (
                <Polygon
                    positions={points}
                    pathOptions={{
                        color: activeColor,
                        fillColor: activeColor,
                        fillOpacity: 0.3,
                        weight: 2,
                        dashArray: '5, 10'
                    }}
                />
            )}
        </MapContainer>
    )
})
