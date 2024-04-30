import { Schema, model } from "mongoose";

interface ISeiyuu {
    name: string,
    picture: string,
    tatemae: number
};

const SeiyuuSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    picture: {
        type: String,
        required: true
    },

    tatemae: {
        type: Number,
        default: 0
    }
});

export default model<ISeiyuu>('Seiyuu', SeiyuuSchema);
