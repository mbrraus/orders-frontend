import api from "@/api/api";

const API_URL = "/orders";

async function getAllOrders() {
    const response = await api.get(API_URL);
    return response.data.content;
}

async function createOrder({customerId, orderItems}) {
    const response = await api.post(API_URL, {
        customerId,
        orderItems
    });
    return response.data;
};

export default {
    getAllOrders,
    createOrder
};