"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class ProjectController {
    constructor() {
        this.getStockData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { stock, like } = req.query;
            const likeBool = like && like === 'true' ? true : false;
            const ipAddress = req.ip;
            if (!Array.isArray(stock)) {
                const stockData = yield utils_1.getStockData({
                    symbol: stock,
                    ipAddress,
                    like: likeBool,
                    type: 'single'
                });
                res.json({ stockData });
            }
            else {
                let [firstSymBol, secondSymbol] = stock;
                firstSymBol = yield utils_1.getStockData({
                    symbol: firstSymBol,
                    ipAddress,
                    like: likeBool,
                    type: 'double',
                    secondSymbol
                });
                secondSymbol = yield utils_1.getStockData({
                    symbol: secondSymbol,
                    ipAddress,
                    like: likeBool,
                    type: 'double',
                    secondSymbol: firstSymBol.stock
                });
                const stockData = [firstSymBol, secondSymbol];
                res.json({ stockData });
            }
        });
        this.getStockInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { stock } = req.query;
            const stockInfo = yield utils_1.getStockInfo(stock);
            res.json(stockInfo);
        });
        this.getSymbol = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { keywords } = req.query;
            const matches = yield utils_1.searchSymbol(keywords);
            res.json({ matches });
        });
    }
}
exports.default = ProjectController;
//# sourceMappingURL=StockCheckerController.js.map