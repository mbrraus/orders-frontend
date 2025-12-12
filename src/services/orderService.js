import api from "@/api/api";

const API_URL = "/orders";

async function getAllOrders() {
    const response = await api.get(API_URL);
    return response.data.content;
}

async function createOrder(order) {
    const response = await api.post(API_URL, order);
    return response.data;
};

export default {
    getAllOrders,
    createOrder
};