import axios from "axios";

const RestGateway = (endPoint) => {
    const fetchItem = async () => {
        const response = await axios.get(endPoint);
        return response;
    };

    const readItem = async (id) => {
        const response = await axios.get(`${endPoint}/${id}`);
        return response;
    };

    const createItem = async (options) => {
        const {body} = options;
        const config = {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        };
        const response = await axios.post(`${endPoint}`, JSON.stringify(body), config);
        return response;
    };

    const updateItem = async (id, options) => {
        const {body} = options;
        const config = {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        };
        const response = await axios.put(`${endPoint}/${id}`, JSON.stringify(body), config);
        return response;
    };

    const deleteItems = async (ids) => {
        const promises = [];
        for (const id of ids) {
            const promise = deleteItem(id);
            promises.push(promise);
        }
        const responses = axios.all(promises);
        return responses;
    };

    const deleteItem = async (id) => {
        try {
            const response = await axios.delete(`${endPoint}/${id}`);
            response.data.id = id;
            return response;
        } catch (e) {
            if (e && e.response && e.response.status === 404) {
                return e.response;
            }
            throw e;
        }
    };

    return { fetchItem, createItem, readItem, updateItem, deleteItem, deleteItems };
};

export default RestGateway;
