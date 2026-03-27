import { Router } from 'express';
import { productModel } from '../models/product.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        
        const filter = query ? { $or: [{ category: query }, { status: query === 'true' }] } : {};
        
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        };

        const products = await productModel.paginate(filter, options);

        res.send({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&limit=${limit}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&limit=${limit}` : null
        });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al obtener productos' });
    }
});

export default router;