import productsModel from "../models/products.model.js";

class ProductManager {

    getProductsPaginated = async (limit, page, category, sort) => {
        try {
            if(category){
                if(sort){
                    const result = await productsModel.paginate({category:category},{
                        limit: limit,
                        page: page,
                        lean: true,
                        sort: {price: sort} 
                    })
                    return (result);
                }else{
                    const result = await productsModel.paginate({category: category}, {
                        limit: limit,
                        page: page,
                        lean: true
                    })
                    return (result);
                } 
            }else{
                if(sort){
                    const result = await productsModel.paginate({}, {
                        limit: limit,
                        page: parseInt(page),
                        lean: true,
                        sort: {price: sort}
                    })
                    return(result)
                }else{
                    const result = await productsModel.paginate({}, {
                        limit: limit,
                        page: parseInt(page),
                        lean: true
                    })
                    return (result)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }


    getProductsList = async() => {
        const ProductsList = await productsModel.find({}).lean().exec()
        return (ProductsList)
    }
    generateId = async() => {
        let list = await this.getProductsList()
        if(list.length === 0) return 1
        return list[list.length - 1].pid + 1
    }
    addProducts = async({ title, description, price, category, thumbnail, stock }) => {
        try {
            const pid= await this.generateId()
            const newProduct = {
                pid,
                title,
                description,
                price,
                status: true,
                category,
                thumbnail,
                stock
            }
            const productGenerated = new productsModel(newProduct)
            await productGenerated.save()
            console.log(`Product ${title} created`)
        } catch (error) {
            console.log(error)
        }
    }
    getProductsById = async (pid) => {
        try {
            const product = await productsModel.findOne({_id: pid}).lean().exec()
            return (product)
        } catch (error){
            console.log(error)
        }
    }
    updateProduct = async (productId, updatedFields) => {
        try {
            const product = await productsModel.findByIdAndUpdate(productId, { $set: updatedFields }, { new: true });
            if (!product) {
                console.log(`Product with ID ${productId} not found.`);
            } else {
                console.log(`Product ${productId} updated successfully.`);
            }
        } catch (error) {
            console.log(`An error occurred while updating product ${productId}: ${error}`);
        }
    };
    deleteProduct = async (pid) => {
        try {
            const product = await productsModel.findByIdAndDelete(pid);
            if (!product) {
                console.log(`Product with ID ${pid} not found.`);
            } else {
                console.log(`Product ${pid} deleted successfully.`);
            }
        } catch (error) {
            console.log(`An error occurred while deleting product ${pid}: ${error}`);
        }
    }
}

export default ProductManager