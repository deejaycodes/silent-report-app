export interface Location {
  lat: number;
  lng: number;
}

export interface Incident {
  id?: string;
  type: string;
  description: string;
  location: Location;
  contact?: {
    email?: string;
    phone?: string;
  };
  createdAt?: Date;
  assignedNgo?: NGO;
}

export interface NGO {
  id: string;
  name: string;
  region: string;
  location: Location;
  trackRecord: number;
}
