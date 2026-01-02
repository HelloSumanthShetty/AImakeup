import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import makeupRoutes from './routes/makeupRoutes';

dotenv.config({ path: '../src/.env' }); // Load from parent src/.env if possible, or standard .env

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', makeupRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
