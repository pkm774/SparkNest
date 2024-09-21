/**
 * Main entry point for the server application.
 */

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { initializePassport } from "./config/passport.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import { connectDB } from "./db/db.js";
import config from "./config/config.js";

const app = express();

// Middleware setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (config.allowedOrigins) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: config.session.cookie.secure },
  })
);

// Initialize passport
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Connect to the database
connectDB();

// Set up routes
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", subscriptionRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Blog Website API" });
});

// Start server
app.listen(config.port, config.hostname, () => {
  console.log(`Server running at http://${config.hostname}:${config.port}/`);
});
