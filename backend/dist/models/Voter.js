"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const VoterSchema = new mongoose.Schema({
    voterIp: {
        type: String,
        required: true
    },
    stocksLiked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stock'
        }
    ]
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose.model('Voter', VoterSchema);
//# sourceMappingURL=Voter.js.map