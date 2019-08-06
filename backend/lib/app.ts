import * as express from 'express';
import * as mongoose from 'mongoose';
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const uuidv1 = require('uuid/v1');
require('dotenv').config();

// tests

import FccTestingRoute from './routes/FccTestingRoute';

interface sessionConfigType {
  secret: string;
  genid: () => string;
  cookie: { secure?: boolean };
  resave: boolean;
  saveUninitialized: boolean;
}

class App {
  public app: express.Application = express();
  public fccTestingRoute: FccTestingRoute = new FccTestingRoute();
  private mongoSetup = (): void => {
    (<any>mongoose).Promise = global.Promise;
    mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true
    });
    mongoose.set('useFindAndModify', false);
  };
  constructor() {
    this.app.use(cors({ optionSuccessStatus: 200, origin: '*' }));
    this.mongoSetup();
    this.app.use(helmet());
    this.app.use(helmet.noSniff());
    this.app.use(helmet.xssFilter());
    // secure cookies with express-session
    const sessionConfig: sessionConfigType = {
      secret: process.env.SECRET_KEY,
      genid: () => uuidv1(),
      cookie: {},
      resave: true,
      saveUninitialized: true
    };
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    if (process.env.NODE_ENV === 'production') {
      this.app.set('trust proxy', 1); // trust first proxy
      sessionConfig.cookie.secure = true; // serve secure cookies
    }

    this.app.use(session(sessionConfig));
    this.app.use(express.static(path.join(__dirname, '../../frontend/build')));
    // Handle React routing, return all requests to React app
    this.app.get('/*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
    });

    this.fccTestingRoute.routes(this.app);

    //404 Not Found Middleware
    this.app.use((req, res, next) => {
      res
        .status(404)
        .type('text')
        .send('Not Found');
    });
  }
}

export default new App().app;
