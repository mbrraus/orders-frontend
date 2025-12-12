import api from "@/api/api";

const API_URL = "/customers";

async function getAllCustomers() {
    const response = await api.get(API_URL);
    return response.data;
}

async function createCustomer(customer) {
    const response = await api.post(API_URL, customer);
    return response.data;
};

export default {
    getAllCustomers,
    createCustomer
};