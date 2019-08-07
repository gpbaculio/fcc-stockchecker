"use strict";
/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chaiHttp = require('chai-http');
const chaiModule = require('chai');
const assert = chaiModule.assert;
const server_1 = require("../server");
chaiModule.use(chaiHttp);
suite('Functional Tests', function () {
    suite('GET /api/stock-prices => stockData object', function () {
        test('1 stock', function (done) {
            chaiModule
                .request(server_1.default)
                .get('/api/stock-prices')
                .query({ stock: 'goog' })
                .end(function (err, res) {
                //complete this one too
                done();
            });
        });
        test('1 stock with like', function (done) { });
        test('1 stock with like again (ensure likes arent double counted)', function (done) { });
        test('2 stocks', function (done) { });
        test('2 stocks with like', function (done) { });
    });
});
//# sourceMappingURL=2_functional-tests.js.map