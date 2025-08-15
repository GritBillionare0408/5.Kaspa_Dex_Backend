import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const router = express.Router();

const corsOptions: CorsOptions = {
	origin: '*', // Allow all origins; replace with array or function to restrict
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
	credentials: false, // Set to true if you want to allow cookies/auth headers
	preflightContinue: false, // Pass control to next handler after OPTIONS
	optionsSuccessStatus: 204, // Some legacy browsers choke on 204
};
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, PUT, DELETE"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
	next();
});

app.use(cors({ origin: "*", }));
app.use('/api', router);

router.get("", async (req: Request, res: Response) => {
	try {
		console.log("New Request : ", new Date())
		res.json({ state: true, message: "✅ Good Network" });
	} catch {
		res.json({ state: false, message: '❌ Bad Network' })
	}
})

// Start server on port 5184
const PORT = 5184;
app.listen(PORT, () => {
	console.log(`HTTP server running on port ${PORT}`);
});
