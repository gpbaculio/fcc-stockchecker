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
const Stock_1 = require("../models/Stock");
const axios = require('axios');
exports.saveStock = (symbol) => __awaiter(this, void 0, void 0, function* () {
    const stock = yield Stock_1.default.create({
        symbol: symbol.toLowerCase()
    });
    return stock;
});
exports.getStockData = ({ symbol, ipAddress, like }) => __awaiter(this, void 0, void 0, function* () {
    const stockPrice = yield axios
        .get(process.env.STOCK_API_BASE_URL_QUERY, {
        params: {
            function: process.env.STOCK_API_FUNCTION,
            symbol,
            apikey: process.env.STOCK_API_KEY
        }
    })
        .then(({ data: { 'Global Quote': globalQuote } }) => globalQuote['05. price']);
    let stock = yield Stock_1.default.findOne({ symbol: symbol.toLowerCase() });
    if (!stock) {
        stock = yield exports.saveStock(symbol);
    }
    if (!stock.likersIp.includes(ipAddress) && like) {
        stock = yield Stock_1.default.findOneAndUpdate({ symbol: symbol.toLowerCase() }, {
            $set: { totalLikes: stock.totalLikes || 0 + 1 },
            $push: { likersIp: ipAddress }
        }, { new: true });
    }
    else if (stock.likersIp.includes(ipAddress) && like) {
        stock = yield Stock_1.default.findOneAndUpdate({ symbol: symbol.toLowerCase() }, {
            $set: {
                totalLikes: stock.totalLikes - 1,
                likersIp: stock.likersIp.filter(iAdd => iAdd !== ipAddress)
            }
        }, { new: true });
    }
    return {
        stock: symbol,
        price: stockPrice,
        likes: stock.totalLikes
    };
});
exports.getStockInfo = (symbol) => __awaiter(this, void 0, void 0, function* () {
    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (_key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        };
    };
    const stockInfo = yield axios
        .get(process.env.STOCK_API_BASE_URL_QUERY, {
        params: {
            function: 'TIME_SERIES_INTRADAY',
            symbol,
            interval: '5min',
            apikey: process.env.STOCK_API_KEY
        }
    })
        .then(({ data }) => JSON.parse(JSON.stringify(data, getCircularReplacer())));
    return stockInfo;
});
exports.searchSymbol = (symbol) => __awaiter(this, void 0, void 0, function* () {
    const { data: { bestMatches } } = yield axios.get(process.env.STOCK_API_BASE_URL_QUERY, {
        params: {
            function: 'SYMBOL_SEARCH',
            keywords: symbol,
            apikey: process.env.STOCK_API_KEY
        }
    });
    return bestMatches;
});
//# sourceMappingURL=utils.js.map