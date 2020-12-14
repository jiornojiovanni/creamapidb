import mongoose from 'mongoose';

const gameDataSchema = new mongoose.Schema({
    appid: Number,
    name: String,
    path: String,
}, {
    versionKey: false,
});

export default mongoose.model('User', gameDataSchema);
