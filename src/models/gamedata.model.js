import mongoose from 'mongoose';

const gameDataSchema = new mongoose.Schema({
    appid: {
        type: Number,
        unique: true
    },
    name: String,
    path: String,
});

export default mongoose.model('Gamedata', gameDataSchema);
