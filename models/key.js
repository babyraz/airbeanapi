import mongoose from "mongoose";

const Schema = mongoose.Schema;

const keySchema = new Schema({
    key : {
        type: String,
        required : true,
        unique : true
    }
});

const Key = mongoose.model('Key', keySchema, "Keys");

export default Key;