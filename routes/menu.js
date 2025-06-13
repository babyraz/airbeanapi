import { Router } from 'express';
import { getMenu, getProduct } from '../services/menu.js';
import Product from '../models/product.js';
import { v4 as uuid } from 'uuid';
import { isAdmin } from '../middlewares/isAdmin.js';
import { authenticateUser } from '../middlewares/authenticateUser.js';

const router = Router();

router.get('/', async (req, res, next) => {
    const menu = await getMenu();
    if(menu) {
        res.json({
            success : true,
            menu : menu
        });
    } else {
        next({
            status : 404,
            message : 'Menu not found'
        });
    }
})

router.post('/', authenticateUser, isAdmin, async (req, res, next) => {
    try {
        const { title, desc, price } = req.body;

        const newProduct = new Product({
            title,
            desc,
            price,
            prodId: `product-${uuid().substring(0, 5)}`
            },  {
                timestamps: true
                });
                
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (err) {
        next(err); 
    }
});

router.put('/:prodId', authenticateUser, isAdmin, async (req, res, next) => {
    try {
        const { title, desc, price } = req.body;

        const updatedProduct = await Product.findOneAndUpdate(
            { prodId: req.params.prodId },
            {title, desc, price },
            { new: true }
        );

        if(!updatedProduct) {
            return res.status(404).json({
                message: 'Product not found'
            })
        }
        res.json(updatedProduct);

    } catch (err) {
        next(err);
    }
})

router.delete('/:prodId', authenticateUser, isAdmin, async (req, res, next) => {
    const prodId = req.params.prodId;

    try {
        const deletedProduct = await Product.findOneAndDelete(prodId);

        if(!deletedProduct){
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.json({
            success: true,
            message: `${deletedProduct.title} has been deleted`,
            deletedProduct
        });

    } catch (err) {
        next(err);
    }
})

export default router;