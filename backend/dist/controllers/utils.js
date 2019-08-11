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
const axios = require('axios');
exports.getStockPrice = (symbol) => __awaiter(this, void 0, void 0, function* () {
    const stockPrice = yield axios
        .get(process.env.STOCK_API_BASE_URL_QUERY, {
        params: {
            function: process.env.STOCK_API_FUNCTION,
            symbol,
            apikey: process.env.STOCK_API_KEY
        }
    })
        .then(({ data: { 'Global Quote': globalQuote } }) => {
        console.log('globalQuote ', globalQuote['05. price']);
        return globalQuote['05. price'];
    });
    console.log('stockPrice ', stockPrice);
    return {
        stock: symbol,
        price: stockPrice
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
//# sourceMappingURL=utils.js.map