import { Router } from "express";
import { Log } from ".";

export const router = Router();

router.get("/", async (req, res) => {
    const limit = <string> req.query.limit;
    const offset = <string> req.query.offset;

    const logs = await Log.findAll(parseInt(limit || "100"), parseInt(offset || "0"));

    res.json(logs);
});

router.post("/", async (req, res) => {
    // const hrStart = process.hrtime();
    const log = new Log(req.body);

    try {
        await log.save();
        // const hrEnd = process.hrtime(hrStart);
        // console.info(`Executing POST log took ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms.`);
        res.status(201).send("OK");
        // const hrEndWeb = process.hrtime(hrStart);
        // console.info(`Executing POST log took ${hrEndWeb[0]}s ${hrEndWeb[1] / 1000000}ms including web response.`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});

router.put("/", async (req, res) => {
    const log = new Log(req.body);

    try {
        await log.save();
        res.status(200).send("OK");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});

router.delete("/", async (req, res) => {
    if (typeof req.query.id === "string") {
        try {
            const log = await Log.findById(parseInt(req.query.id));

            await log.delete();

            res.status(200).send("OK");
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal server error.");
        }
    } else {
        res.status(500).send("Internal server error.");
    }
});