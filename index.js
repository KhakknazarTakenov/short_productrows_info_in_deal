import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import timeout from "connect-timeout";
import fs from "fs";
import './global.js';

import {logMessage} from "./logger/logger.js";
import {DealsService} from "./services/deals.js";

const envPath = path.join(process.cwd(), '.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = 1673;

const BASE_URL = "/short_productrows_info/";

app.use(cors({
    origin: "*",
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(timeout('20m'));

app.post(BASE_URL+"process_deal/", async (req, res) => {
    try {
        const dealId = req.query.deal_id;
        const bxLnk = req.query.bx_link;
        const infoUFId = req.query.info_uf_id;

        const dealsService = new DealsService(bxLnk);

        const deal = await dealsService.getDealFromBx(dealId);
        const productRows = (await dealsService.getDealProductrows(dealId)).map(productrow => {
            return {
                "id": productrow["ID"],
                "name": productrow["PRODUCT_NAME"],
                "quantity": productrow["QUANTITY"],
            }
        });
        let info = "ID - Название - Кол-во\n";
        productRows.forEach(item => {
            info += `${item.id} - ${item.name} - ${item.quantity}\n`;
        })

        const updateResult = await dealsService.updateDealById(dealId, infoUFId, info);

        if (updateResult) {
            logMessage(LOG_TYPES.A, "process_deal", `Deal ${dealId} productrows written successfully!`);
            res.status(200).json({"status": true, "status_msg": "success", "message": `Deal ${dealId} productrows written successfully!`});
        } else {
            throw new Error(`Error while updating deal ${dealId}`)
        }
    } catch (error) {
        logMessage(LOG_TYPES.E, "process_deal", error);
        res.status(500).json({"status": false, "status_msg": "error", "message": "server error"});
    }
})

app.listen(PORT, async () => {
    console.log(`App running on port ${PORT}`)
})