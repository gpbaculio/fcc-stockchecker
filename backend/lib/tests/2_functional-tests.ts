/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chaiHttp = require('chai-http');
const chaiModule = require('chai');
const assert = chaiModule.assert;
import server from '../server';

chaiModule.use(chaiHttp);

suite('Functional Tests', () => {
  suite('GET /api/stock-prices => stockData object', () => {
    test('1 stock', done => {
      chaiModule
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog' })
        .end(function(err, res) {
          //complete this one too

          done();
        });
    });

    test('1 stock with like', function(done) {});

    test('1 stock with like again (ensure likes arent double counted)', function(done) {});

    test('2 stocks', function(done) {});

    test('2 stocks with like', function(done) {});
  });
});
