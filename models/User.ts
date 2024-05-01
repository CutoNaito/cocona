import { Types, Schema, model } from "mongoose";

interface IUser {
    discord_id: string,
    tatemae: number
};

const UserSchema = new Schema({
    discord_id: {
        type: String,
        required: true,
        unique: true
    },

    tatemae: {
        type: Number,
        default: 0
    }
});

export default model<IUser>('User', UserSchema);
