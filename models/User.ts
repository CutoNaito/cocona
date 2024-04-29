import { Schema, model } from "mongoose";

interface IUser {
    name: string,
    seiyuus: string[],
    tatemae: number
};

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    seiyuus: [{
        type: Schema.Types.ObjectId,
        ref: 'Seiyuu'
    }],

    tatemae: {
        type: Number,
        default: 0
    }
});

export default model<IUser>('User', UserSchema);
