"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const StockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose.model('Stock', StockSchema);
//# sourceMappingURL=Stock.js.map