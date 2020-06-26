import RestGateway from "../common/RestGateway";
const host = process.env.REACT_APP_SERVER_ENDPOINT || "http://localhost:5000";

export default class UserGateway extends RestGateway {
    constructor() {
        super(`${host}/users`);
    }

    async fetchItems() {
        const response = await super.fetchItems();
        const users = response.data || []
        users.sort((a, b) => b.updatedAt - a.updatedAt);
        return response;
    }

    async createItem(payload) {
        const {body} = payload;
        body.updatedAt = Date.now();
        body.createdAt = Date.now();
        return await super.createItem(payload);
    }

    async updateItem(id, payload) {
        const {body} = payload;
        body.updatedAt = Date.now();
        return await super.updateItem(id, payload);
    }
}