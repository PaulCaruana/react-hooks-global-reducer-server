import axios from "axios";

export default class RestGateway {
    constructor(endPoint) {
        this.endPoint = endPoint;
    }

    async fetchItems() {
        return await axios.get(this.endPoint);
    }

    async createItem(payload) {
        const {body} = payload;
        const config = {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        };
        return await axios.post(`${this.endPoint}`, JSON.stringify(body), config);
    }

    async readItem(id) {
        return await axios.get(`${this.endPoint}/${id}`);
    }

    async updateItem(id, payload) {
        const {body} = payload;
        const config = {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        };
        return await axios.put(`${this.endPoint}/${id}`, JSON.stringify(body), config);
    }

    async deleteItem(id) {
        try {
            const response = await axios.delete(`${this.endPoint}/${id}`);
            response.data.id = id;
            return response;
        } catch (e) {
            if (e && e.response && e.response.status === 404) {
                return e.response;
            }
            throw e;
        }
    }

}
