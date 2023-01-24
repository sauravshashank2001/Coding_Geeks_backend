import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config({
  path: "./config/config.env",
});
const app = express();
import {createRequire} from "module"
const require = createRequire(import.meta.url);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

// Using Middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);


app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Importing & Using Routes
import course from "./routes/courseRoutes.js";
import user from "./routes/userRoutes.js";
import payment from "./routes/paymentRoutes.js";
import other from "./routes/otherRoutes.js";
import { buySubscription } from "./controllers/paymentController.js";
import { isAuthenticated } from "./middlewares/auth.js";
app.use("/api/v1", course);
app.use("/api/v1", user);
app.use("/api/v1", other);
app.use("/api/v1",payment)

app.get("/api/v1/config", (req, res) => {
  res.status(200).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});


app.post("/api/v1/create-payment-intent",async (req,res,next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: 299,
        currency: "inr",
        metadata: {
            company : "coursebundler",
        },
    });
    res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret
    });
});

export default app;

app.get("/", (req, res) =>
  res.send(
    `<h1>Site is Working. click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`
  )
);

app.use(ErrorMiddleware);
