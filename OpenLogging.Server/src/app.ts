import dotenv from "dotenv";
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";

// Load environment variables from .env file;
dotenv.config();

import { database } from "./lib/database";
import { router as logRouter, Log } from "./lib/log";

// Setup Express;
const app = express();

// Setup proxy;
if (process.env.PROXY_ADDR != undefined) {
    app.set("trust proxy", process.env.PROXY_ADDR);
}

// Setup body-parser with the app;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup cors;
app.use(cors());

// Setup morgan to use the development logging or production;
if (app.get("env") == "production") {
    app.use(morgan("common", {
        skip: function(req, res) {
            return res.statusCode < 400
        }
    }))
} else {
    app.use(morgan("dev"));
}

// Setup routes;
app.use("/api/log", logRouter);

const startServer = async () => {
    console.log(`Opening MySQL connection...`);
    try {
        await database.connect();

        // Check if logs table exists;
        await new Promise(async (resolve, reject) => {
            database.getConnection().query("SHOW TABLES LIKE ?", ["logs"], async (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length < 1) {
                        console.log(`Logs table doesnt exist. Creating now...`);
                        await Log.createTable();
                        console.log(`Logs table created.`);
                        resolve();
                    } else {
                        resolve();
                    }
                }
            });
        });
    } catch (err) {
        console.error("An error occured while connecting to the database.", err);
        process.exit(1000);
    }

    console.log(`Starting HTTP server...`);
    const httpPort = process.env.PORT || 3000;

    const httpServer = http.createServer(app);

    await new Promise(resolve => httpServer.listen(httpPort, resolve));
    console.log(`Listening on port ${httpPort}`);
}

startServer();