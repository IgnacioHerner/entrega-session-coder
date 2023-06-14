import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const cartCollection = 'carts'

const carstSchema = new mongoose.Schema({
    products: {
        type: [
            {
                pid: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                qty: {
                    type: Number,
                    default: 1
                }
            }
        ]
    }
})
carstSchema.plugin(mongoosePaginate)
const cartsModel = mongoose.model(cartCollection, carstSchema)

export default cartsModel;
