import { Router } from "express";
import ProductManager from "../dao/manager/product.manager.js";

const router = Router()
const pm = new ProductManager()

router.get('/', async(req, res) => {
    const result = await pm.getProductsPaginated(100)
    result.prevLink = result.hasPrevPage ? `/?page=${result.prevPage}` : ''
    result.nextLink = result.hasNextPage ? `/?page=${result.nextPage}` : ''
    res.render('home', {result})
})

router.get('/:pid', async(req, res) => {
    const pid = req.params.pid
    const product = await pm.getProductsById(pid)
    res.render('details', {product})
})

router.post('/', async(req, res) => {
    const data = req.body
    if(!data.title || !data.description || !data.price || !data.category || !data.stock){
        res.status(206).send("Incomplete fields")
    } else {
        await pm.addProducts(data)
        res.status(201).send('Product created')
    }
})

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid
    const data = req.body
    await pm.updateProduct(pid, data)
    res.status(202).send('Product uptaded')
})

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid
    await pm.deleteProduct(pid)
    res.send("Product deleted")
})


export default router