import type { NGO } from '../types';

const ngos: NGO[] = [
  {
    id: 'ngo1',
    name: 'Hope Foundation',
    region: 'Lagos',
    location: { lat: 6.5244, lng: 3.3792 },
    trackRecord: 8.5
  },
  {
    id: 'ngo2',
    name: 'Safe Shelter',
    region: 'Abuja',
    location: { lat: 9.0765, lng: 7.3986 },
    trackRecord: 9.0
  },
  {
    id: 'ngo3',
    name: 'Unity Aid',
    region: 'Lagos',
    location: { lat: 6.4654, lng: 3.4064 },
    trackRecord: 7.5
  }
];

export default ngos;
