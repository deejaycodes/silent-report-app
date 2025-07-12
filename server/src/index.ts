import express from 'express';
import dotenv from 'dotenv';
import incidentsRouter from './routes/incidents';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/incidents', incidentsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
