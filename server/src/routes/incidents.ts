import { Router } from 'express';
import { submitIncident } from '../services/aiService';
import { incidents } from '../store/incidents';
import type { Incident } from '../types';

const router = Router();

router.get('/', (req, res) => {
  res.json(incidents);
});

router.get('/:id', (req, res) => {
  const incident = incidents.find(i => i.id === req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  res.json(incident);
});

router.post('/', async (req, res) => {
  const incident = req.body as Incident;
  const id = `inc_${Date.now()}`;
  try {
    const result = await submitIncident(incident);
    const record = { ...incident, id, assignedNgo: result.ngo, createdAt: new Date() };
    incidents.push(record);
    res.status(201).json({ id, assignedNgo: result.ngo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit incident' });
  }
});

export default router;
