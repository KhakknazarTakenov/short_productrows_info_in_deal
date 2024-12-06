import {Bitrix} from "@2bad/bitrix";
import {logMessage} from "../logger/logger.js";

class DealsService {
    constructor(link) {
        this.bx = Bitrix(link);
    }

    getDealFromBx(id) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve((await this.bx.deals.get(id)).result);
            } catch (error) {
                logMessage(LOG_TYPES.E, "DealsService.getDealFromBx", error);
                resolve(null)
            }
        })
    }

    getDealProductrows(dealId) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve((await this.bx.call("crm.deal.productrows.get", { "id": dealId })).result);
            } catch (error) {
                logMessage(LOG_TYPES.E, "DealsService.getDealFromBx", error);
                resolve(null)
            }
        })
    }

    updateDealById(dealId, uf_id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve((await this.bx.deals.update(dealId, { [uf_id]: data })).result);
            } catch (error) {
                logMessage(LOG_TYPES.E, "DealsService.getDealFromBx", error);
                resolve(null)
            }
        })
    }
}

export { DealsService }