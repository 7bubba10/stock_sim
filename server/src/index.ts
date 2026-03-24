import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req:Request,res:Response) => {
    res.json({status: 'ok'});
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

export default app;