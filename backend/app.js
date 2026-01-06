import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import timesheetRoutes from './routes/timesheetRoutes.js';
import transformRoutes from './routes/transformRoutes.js';

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/timesheets', timesheetRoutes);
app.use('/api/transform', transformRoutes);

app.listen(5000, () => console.log('Server running on 5000'));