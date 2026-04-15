const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 100 }
});

module.exports = mongoose.model('Skill', SkillSchema);
