"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const StockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    likersIp: {
        type: [String],
        required: false
    },
    totalLikes: {
        type: Number,
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose.model('Stock', StockSchema);
//# sourceMappingURL=Stock.js.map