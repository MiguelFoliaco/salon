'use client';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';



import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type Props = {
    position?: [number, number];
    width?: string;
    height?: string;
}

export default function Map({ position = [4.7110, -74.0721], width = '100%', height = '500px' }: Props) {
    return (
        <MapContainer
            // @ts-ignore
            zoom={13}
            scrollWheelZoom={false}
            // @ts-ignore
            center={position} // Bogotá
            // bounds={[4.7110, -74.0721]}

            style={{ width, height, zIndex: 1 }}
        >
            <TileLayer
                // @ts-ignore
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
                // @ts-ignore
                position={position}>
                <Popup>Bogotá 🚀</Popup>
            </Marker>
        </MapContainer>
    );
}