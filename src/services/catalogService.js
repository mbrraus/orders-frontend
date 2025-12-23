import catalogApi from "@/api/catalogApi";

async function getProductBySku(sku) {
    const response = await catalogApi.get(`/products/by-sku/${sku}`);
    return response.data;
}

export default{
    getProductBySku
};
