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
// 5: ~4.9km, 6: ~1.2km, 7: ~152m, 8: ~38m, 9: ~4.8m
export function metersToGeohashLength(meters: number): number {
	if (meters <= 5) return 9;
	if (meters <= 40) return 8;
	if (meters <= 200) return 7;
	if (meters <= 1200) return 6;
	return 5;
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

export default { computeGeohash };
