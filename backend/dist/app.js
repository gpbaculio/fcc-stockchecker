"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const uuidv1 = require('uuid/v1');
require('dotenv').config();
// tests
const FccTestingRoute_1 = require("./routes/FccTestingRoute");
const StockCheckerRoute_1 = require("./routes/StockCheckerRoute");
class App {
    constructor() {
        this.app = express();
        this.fccTestingRoute = new FccTestingRoute_1.default();
        this.stockCheckerRoute = new StockCheckerRoute_1.default();
        this.mongoSetup = () => {
            mongoose.Promise = global.Promise;
            mongoose.connect(process.env.MONGO_DB_URL, {
                useNewUrlParser: true,
                useCreateIndex: true
            });
            mongoose.set('useFindAndModify', false);
        };
        this.app.use(cors({ optionSuccessStatus: 200, origin: '*' }));
        this.mongoSetup();
        this.app.use(helmet());
        this.app.use(helmet.noSniff());
        this.app.use(helmet.xssFilter());
        // secure cookies with express-session
        const sessionConfig = {
            secret: process.env.SECRET_KEY,
            genid: () => uuidv1(),
            cookie: {},
            resave: true,
            saveUninitialized: true
        };
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.enable('trust proxy');
        sessionConfig.cookie.secure = true; // serve secure cookies
        this.app.use(session(sessionConfig));
        // this.app.use(express.static(path.join(__dirname, '../../frontend/build')));
        // // Handle React routing, return all requests to React app
        // this.app.get('/*', (_req, res) => {
        //   res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
        // });
        this.fccTestingRoute.routes(this.app);
        this.stockCheckerRoute.routes(this.app);
        //404 Not Found Middleware
        this.app.use((req, res, next) => {
            res
                .status(404)
                .type('text')
                .send('Not Found');
        });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map