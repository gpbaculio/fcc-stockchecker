"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const runner = require('./test-runner');
const PORT = process.env.PORT || 8000;
//Start our server and tests!
app_1.default.listen(PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
    if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(() => {
            try {
                runner.run();
            }
            catch (e) {
                var error = e;
                console.log('Tests are not valid:');
                console.log(error);
            }
        }, 1500);
    }
});
exports.default = app_1.default;
//# sourceMappingURL=server.js.map