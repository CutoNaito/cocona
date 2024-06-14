import { Types, Schema, model } from "mongoose";

interface IUser {
    discord_id: string,
    tatemae: number,
    rolls: number,
    can_claim: boolean
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
    },

    rolls: {
        type: Number,
        default: 10
    },

    can_claim: {
        type: Boolean,
        default: true
    }
});

export default model<IUser>('User', UserSchema);
