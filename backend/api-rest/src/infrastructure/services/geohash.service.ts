// Simple geohash encoder (base32) with utility to choose precision based on meters
const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

function encodeGeohash(
	latitude: number,
	longitude: number,
	length: number,
): string {
	let isEven = true;
	let bit = 0;
	let ch = 0;
	let geohash = "";

	let latMin = -90.0,
		latMax = 90.0;
	let lonMin = -180.0,
		lonMax = 180.0;

	while (geohash.length < length) {
		if (isEven) {
			const mid = (lonMin + lonMax) / 2;
			if (longitude > mid) {
				ch = (ch << 1) | 1;
				lonMin = mid;
			} else {
				ch = (ch << 1) | 0;
				lonMax = mid;
			}
		} else {
			const mid = (latMin + latMax) / 2;
			if (latitude > mid) {
				ch = (ch << 1) | 1;
				latMin = mid;
			} else {
				ch = (ch << 1) | 0;
				latMax = mid;
			}
		}

		isEven = !isEven;

		if (++bit === 5) {
			geohash += BASE32[ch];
			bit = 0;
			ch = 0;
		}
	}

	return geohash;
}

// Map desired search radius in meters to geohash length.
// Typical approximate resolutions (meters) for geohash length:
// 2: ~630km, 3: ~78km, 4: ~20km,
// 5: ~4.9km, 6: ~1.2km, 7: ~152m, 8: ~38m, 9: ~4.8m
export function metersToGeohashLength(meters: number): number {
	if (meters <= 4) return 9;
	if (meters <= 35) return 8;
	if (meters <= 150) return 7;
	if (meters <= 1100) return 6;
	if (meters <= 4800) return 5;
	if (meters <= 19000) return 4;
	if (meters <= 75000) return 3;
	return 2;
}

export function computeGeohash(
	latitude: number,
	longitude: number,
	precisionMeters = 100,
): string {
	const clamped = Math.max(1, Math.min(precisionMeters, 20000000));
	const length = metersToGeohashLength(clamped);
	return encodeGeohash(latitude, longitude, length);
}

// Decode a geohash back into a bounding box { minLat, maxLat, minLon, maxLon }
function decodeGeohashBBox(geohash: string): {
	minLat: number;
	maxLat: number;
	minLon: number;
	maxLon: number;
} {
	let isEven = true;
	let latMin = -90.0,
		latMax = 90.0;
	let lonMin = -180.0,
		lonMax = 180.0;

	for (const char of geohash) {
		const idx = BASE32.indexOf(char);
		for (let bit = 4; bit >= 0; bit--) {
			const bitVal = (idx >> bit) & 1;
			if (isEven) {
				const mid = (lonMin + lonMax) / 2;
				if (bitVal === 1) lonMin = mid;
				else lonMax = mid;
			} else {
				const mid = (latMin + latMax) / 2;
				if (bitVal === 1) latMin = mid;
				else latMax = mid;
			}
			isEven = !isEven;
		}
	}

	return { minLat: latMin, maxLat: latMax, minLon: lonMin, maxLon: lonMax };
}

// Compute the geohash neighbor in a given direction (dx, dy)
function computeNeighbor(geohash: string, dx: number, dy: number): string {
	const bbox = decodeGeohashBBox(geohash);
	const latHeight = bbox.maxLat - bbox.minLat;
	const lonWidth = bbox.maxLon - bbox.minLon;
	const centerLat = (bbox.minLat + bbox.maxLat) / 2 + dy * latHeight;
	const centerLon = (bbox.minLon + bbox.maxLon) / 2 + dx * lonWidth;
	return encodeGeohash(centerLat, centerLon, geohash.length);
}

/**
 * Returns the center geohash plus its 8 surrounding neighbors.
 * This solves the geohash edge-effect problem where points near
 * cell boundaries would be missed by a single-prefix search.
 */
export function geohashNeighbors(geohash: string): string[] {
	const neighbors = new Set<string>();
	neighbors.add(geohash);
	for (let dx = -1; dx <= 1; dx++) {
		for (let dy = -1; dy <= 1; dy++) {
			if (dx === 0 && dy === 0) continue;
			neighbors.add(computeNeighbor(geohash, dx, dy));
		}
	}
	return Array.from(neighbors);
}

export default { computeGeohash, geohashNeighbors };
