import { Types, Schema, model } from "mongoose";

export type Claim = {
    user: Types.ObjectId,
    seiyuu: Types.ObjectId,
};

interface IServer {
    server_id: string,
    claims: Claim[]
};

const ServerSchema = new Schema({
    server_id: {
        type: String,
        required: true
    },

    claims: [{
        user: {
            type: Types.ObjectId,
            ref: 'User',
            required: true
        },
        seiyuu: {
            type: Types.ObjectId,
            ref: 'Seiyuu',
            required: true
        }
    }]
});

export default model<IServer>('Server', ServerSchema);

