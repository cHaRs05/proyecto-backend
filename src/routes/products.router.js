import { Router } from 'express';
import { productModel } from '../models/product.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        let filter = {};
        
        if (query) {
            if (query === 'true' || query === 'false') {
                filter = { status: query === 'true' };
            } else {
                filter = { category: query };
            }
        }

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true, 
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        };

        const result = await productModel.paginate(filter, options);
        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
        
        res.send({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null,
            nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).lean();
        if (!product) return res.status(404).send({ status: "error", error: "Producto no encontrado" });
        res.send({ status: "success", payload: product });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

export default router;