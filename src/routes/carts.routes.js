import { Router } from "express";
import CartManager from "../dao/manager/cart.manager.js";

const router = Router()
const cm = new CartManager()

router.post('/', (req, res) => {
    cm.createCart()
    res.status(201).send("New cart created")

})

router.get('/:cid', async(req, res) => {
    const cid = req.params.cid
    const list = await cm.getProductsFromCart(cid)
    res.send(list)
})

router.post('/:cid/products/:pid',  async(req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const result = await cm.addProductToCart(cid, pid)
    res.status(201).send(result)
})

router.put('/:cid', async (req, res) => {
    const cid = req.params.cid
    const newData = req.body
    await cm.updateCart(cid, newData)
    res.send('Cart uptaded')
})

router.delete('/:cid/products/:pid', async(req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    await cm.deleteOneProductFromACart(cid, pid)
    res.send('Product deleted')
})

router.delete('/:cid', async(req, res) => {
    const cid = req.params.cid
    await cm.deleteOneCart(cid)
    res.send(`Product ${cid} eliminated`)
})

export default router