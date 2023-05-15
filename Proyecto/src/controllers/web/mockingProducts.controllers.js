import * as mockingProductsService from '../../services/mockingProducts.service.js'

const mockingProducts = async (req, res) => {
    const result = await mockingProductsService.getProducts();

    res.send({
        count: result.length,
        data: result
    })
};


export { 
    mockingProducts
}