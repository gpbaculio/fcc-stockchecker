/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const StockCheckerController_1 = require("../controllers/StockCheckerController");
class StockCheckerRoute {
    constructor() {
        this.stockCheckerController = new StockCheckerController_1.default();
        this.routes = (app) => {
            app
                .route('/api/stock-prices')
                .get(this.stockCheckerController.getStockData);
            app.route('/api/stock-info').get(this.stockCheckerController.getStockInfo);
            app.route('/api/search-symbol').get(this.stockCheckerController.getSymbol);
        };
    }
}
exports.default = StockCheckerRoute;
//# sourceMappingURL=StockCheckerRoute.js.map