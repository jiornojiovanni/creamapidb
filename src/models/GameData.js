import mongoose from 'mongoose';

const GameDataSchema = new mongoose.Schema({
    id: Number,
    name: String,
    path: String,
}, {
    versionKey: false,
});

const GameData = mongoose.model('GameData', GameDataSchema, 'GameData');

export default GameData;
