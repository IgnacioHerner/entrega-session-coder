import cartsModel from "../models/carts.model.js";

class CartManager {

    getCartsList = async () => {
        const cartsList = await cartsModel.find({}).lean().exec()
        return(cartsList)
    }

    generateId = async () => {
        let list = await this.getCartsList()
        if(list.length === 0) return 1
        return list[list.length - 1].cid +1
    }

    createCart = async () => {
        const newCart = {products:[]}
        const cartGenerated = new cartsModel(newCart)
        await cartGenerated.save()
        return cartGenerated
    }

    getProductsFromCart = async (cid) => {
        try {
            const cart = await cartsModel.findById(cid).populate('products.pid').lean().exec();
            if (!cart) {
                console.log(`Cart with ID ${cid} not found.`);
                return null;
            }
            return cart;
        } catch (error) {
            console.log(`An error occurred while fetching products from cart ${cid}: ${error}`);
            return null;
        }
    }

    getCartById=async(cid)=>{
        try {
            const cart= await cartsModel.paginate({_id: cid},{
                limit:1,
                page:1,
                lean:true
               })
            return (cart)
        } catch (error) {
            console.log(error)
        }
    }

    addProductToCart = async (cid, pid) => {
        try {
            const cart = await cartsModel.findOneAndUpdate( // ? findOneAndUpdate() de Mongoose para actualizar el carrito directamente en la base de datos.
                { _id: cid },
                { $inc: { "products.$[elem].qty": 1 } }, // ? inc para incrementar la cantidad (qty) del producto específico en el arreglo products
                { arrayFilters: [{ "elem.pid": pid }] } // ? arrayFilters para encontrar el elemento con el pid correspondiente
            );
    
            if (!cart) {
                throw new Error("Cart not found");
            }
    
            if (cart.nModified === 0) { // ? findOneAndUpdate() no modifica ningún documento (nModified === 0), significa que el producto no existe en el carrito.
                await cartsModel.updateOne(
                    { _id: cid },
                    { $push: { products: { pid, qty: 1 } } }
                );
            }
    
            console.log(`Product ${pid} added to cart ${cid}`);
        } catch (error) {
            console.log(error);
        }
    }

    deleteOneCart = async (cid) => {
        try {
            const result = await cartsModel.deleteOne({ _id : cid });

            if (result.deletedCount === 1) {
                console.log(`Cart ${cid} deleted`)
            } else {
                console.log(`Cart ${cid} not found`)
            }
        } catch (error) {
            console.log(error)
        }
    }

    deleteOneProductFromACart= async(cid, pid)=>{
        const cartSelected= await cartsModel.findOne({_id: cid})
        const productToDelete= cartSelected.products.find(x => x.pid == pid)
        const idx= cartSelected.products.findIndex(x => x.pid == pid)
        if(productToDelete.qty > 1){
            productToDelete.qty = productToDelete.qty-1
        }else{
            cartSelected.products.splice(idx, 1)
        }
        const result= await cartsModel.updateOne({_id:cid}, cartSelected)
        console.log(`Product ${pid} eliminated from cart${cid}`)
        console.log(result)
    }

    updateCart= async(cid, newData)=>{
        const cartToUpdate= await cartsModel.findOne({_id:cid})
        cartToUpdate.products=[]
        cartToUpdate.products.push(newData)
        const result= await cartsModel.updateOne({_id:cid}, cartToUpdate)
        console.log(result)
    }

}

export default CartManager