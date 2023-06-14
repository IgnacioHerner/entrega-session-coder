import { Router } from "express";
import ProductManager from "../dao/manager/product.manager.js";
import CartManager from "../dao/manager/cart.manager.js"
import handlebars from 'express-handlebars'

const router = Router()
const pm = new ProductManager()
const cm = new CartManager()
const hbs = handlebars.create({})

router.get('/', async(req, res) => {
    let limit = req.query.limit
    if(!limit) limit = 10
    let page = req.query.page
    if(!page) page = 1

    const category = req.query.category
    const sort = req.query.sort

    const result = await pm.getProductsPaginated(limit, page, category, sort)
    result.preLink = result.hasPrevPage ? `/products/?limit=${limit}&page=${result.prevPage}` : ''
    result.nextLink = result.hasNextPage ? `/products/?limit=${limit}&page=${result.nextPage}` : ''

    res.render('home', {result})
})

router.get('/cart/:cid', async (req, res) => {
    const cid = req.params.cid
    const carSelected = await cm.getProductsFromCart(cid)
    hbs.handlebars.registerHelper('subtotal', function() {
        return this.qty*this.pid.price
    })
    res.render('cart', {
        carSelected,
        cid
    })
})

export default router