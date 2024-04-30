import { Types, Schema, model } from "mongoose";

interface IUser {
    discord_id: string,
    seiyuus: Types.ObjectId[],
    tatemae: number
};

const UserSchema = new Schema({
    discord_id: {
        type: String,
        required: true,
        unique: true
    },

    seiyuus: [{
        type: Types.ObjectId,
        ref: 'Seiyuu'
    }],

    tatemae: {
        type: Number,
        default: 0
    }
});

export default model<IUser>('User', UserSchema);
