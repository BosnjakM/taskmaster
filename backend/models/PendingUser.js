const mongoose = require("mongoose");

const PendingUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationToken: { type: String, required: true, unique: true }, // Token zur Verifizierung
    createdAt: { type: Date, default: Date.now, expires: 86400 }, // ⏳ Token läuft nach 24 Stunden ab
});

module.exports = mongoose.model("PendingUser", PendingUserSchema);
