import ngos from '../store/ngos';
import type { Incident, NGO } from '../types';

interface AIResponse { ngo: NGO }

export async function submitIncident(incident: Incident): Promise<AIResponse> {
  const url = process.env.AI_SERVICE_URL;
  if (url) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident)
      });
      if (resp.ok) {
        return resp.json();
      }
    } catch (err) {
      console.error('AI service request failed:', err);
    }
  }
  // fallback to local routing
  const ngo = findBestNgo(incident);
  return { ngo };
}

function findBestNgo(incident: Incident): NGO {
  let best: NGO = ngos[0];
  let bestScore = Infinity;
  for (const ngo of ngos) {
    const distance = getDistance(incident.location, ngo.location);
    const score = distance - ngo.trackRecord * 10;
    if (score < bestScore) {
      best = ngo;
      bestScore = score;
    }
  }
  return best;
}

function getDistance(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const aVal = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  return R * c;
}
