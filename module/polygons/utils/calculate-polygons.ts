import { Polygons } from "../actions";

type Point = [number, number]; // [lat, lng]

type PolygonPoints = Point[];

type Polygon = Polygons;

/**
 * Point in Polygon (adaptado a [lat, lng])
 */
const pointInPolygon = (point: Point, points: PolygonPoints): boolean => {
    const [lat, lng] = point;
    let inside = false;

    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [lat_i, lng_i] = points[i];
        const [lat_j, lng_j] = points[j];

        const intersect =
            (lng_i > lng) !== (lng_j > lng) &&
            lat < ((lat_j - lat_i) * (lng - lng_i)) / (lng_j - lng_i) + lat_i;

        if (intersect) inside = !inside;
    }

    return inside;
};

/**
 * Área del polígono (Shoelace adaptado a lat/lng)
 */
const polygonArea = (points: PolygonPoints): number => {
    let area = 0;

    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [lat_i, lng_i] = points[i];
        const [lat_j, lng_j] = points[j];

        area += (lat_j + lat_i) * (lng_j - lng_i);
    }

    return Math.abs(area / 2);
};

/**
 * Bounding Box
 */
const getBoundingBox = (points: PolygonPoints) => {
    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    for (const [lat, lng] of points) {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
    }

    return { minLat, maxLat, minLng, maxLng };
};

const pointInBoundingBox = (
    point: Point,
    bbox: ReturnType<typeof getBoundingBox>
) => {
    const [lat, lng] = point;

    return (
        lat >= bbox.minLat &&
        lat <= bbox.maxLat &&
        lng >= bbox.minLng &&
        lng <= bbox.maxLng
    );
};

/**
 * FUNCIÓN PRINCIPAL
 */
export const calculatePolygons = (
    polygons: Polygon[],
    lat: number,
    lng: number
): Polygon | null => {
    const point: Point = [lat, lng];

    const matches: (Polygon & { area: number })[] = [];

    for (const polygon of polygons) {
        if (!polygon.is_active) continue;

        const points = polygon.points as PolygonPoints;

        if (!points || points.length < 3) continue;

        // 1. Bounding box
        const bbox = getBoundingBox(points);
        if (!pointInBoundingBox(point, bbox)) continue;

        // 2. Preciso
        if (!pointInPolygon(point, points)) continue;

        // 3. Área
        const area = polygonArea(points);

        matches.push({
            ...polygon,
            area
        });
    }

    if (matches.length === 0) return null;

    // 4. Orden inteligente
    matches.sort((a, b) => {
        // menor área = más específico = mayor prioridad
        return a.area - b.area;
    });

    return matches[0];
};