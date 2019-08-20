/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chaiHttp = require('chai-http');
const chaiModule = require('chai');
const axios = require('axios');
const assert = chaiModule.assert;
import server from '../server';
import Stock from '../models/Stock';
import { getStockData } from '../controllers/utils';

chaiModule.use(chaiHttp);

suite('Functional Tests', async function() {
  await suite('GET /api/stock-prices => stockData object', async function() {
    const stock = 'goog';
    const secondStock = 'msft';
    const localHostIp = '127.0.0.1';
    const like = true;
    const mockResult = {
      stock,
      price: '1190.8464',
      likes: 1
    };
    let mockFirstSymbolResult, mockSecondSymbolResult;
    test('1 stock', function(done) {
      chaiModule
        .request(server)
        .get('/api/stock-prices')
        .query({ stock })
        .end(function(_err, res) {
          //complete this one too
          const { stockData: result } = res.body;
          assert.hasAllKeys(result, Object.keys(mockResult));
          assert.strictEqual(result.stock, mockResult.stock);
          assert.isNumber(result.likes);
          assert.isNumber(result.price); // can't strict price, changing every 5 mins.
          mockFirstSymbolResult = result; // save the latest result for other tests
          done();
        });
    });

    test('1 stock with like', function(done) {
      chaiModule
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: secondStock, like })
        .set('Accept', 'application/json')
        .set('X-Forwarded-For', localHostIp)
        .end(function(_err, res) {
          //complete this one too
          const { stockData: result } = res.body;
          assert.hasAllKeys(result, Object.keys(mockFirstSymbolResult)); // same keys as first stock result
          assert.isTrue(
            result.likes === 1, // new stock, increase like 1,
            'likes should be decreased or increased since liking from same ip address'
          );
          mockSecondSymbolResult = result;
          done();
        });
    });

    test('1 stock with like again (ensure likes arent double counted)', function(done) {
      chaiModule
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: secondStock, like })
        .set('Accept', 'application/json')
        .set('X-Forwarded-For', localHostIp)
        .end(function(_err, res) {
          //complete this one too
          const { stockData: result } = res.body;
          assert.hasAllKeys(result, Object.keys(mockFirstSymbolResult));
          assert.isTrue(
            result.likes === 0, // new stock decreased, to be unliked if already liked from same ip address
            'likes should be decreased or increased since liking from same local ip address'
          );
          mockSecondSymbolResult = result;
          done();
        });
    });

    test('2 stocks', function(done) {
      chaiModule
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: [stock, secondStock] })
        .set('Accept', 'application/json')
        .set('X-Forwarded-For', localHostIp)
        .end(function(_err, res) {
          //complete this one too
          const { stockData: result } = res.body; // gets result without liking both stocks
          console.log('result 1', result);
          assert.isArray(result);
          done();
        });
    }).timeout(5000);

    test('2 stocks with like', function(done) {
      chaiModule
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: [stock, secondStock], like }) // like both stocks, result is different, see rel_likes prop in an item
        .set('Accept', 'application/json')
        .set('X-Forwarded-For', localHostIp)
        .end(function(_err, res) {
          //complete this one too
          const { stockData: result } = res.body;
          console.log('result 2', result);
          assert.isArray(result);
          done();
        });
    }).timeout(5000);
  });
});
