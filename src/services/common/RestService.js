import { dispatch, useGlobalState } from "../Store";

export default class RestService {
    constructor(resource, gateway, itemName, itemsName) {
        this.resource = resource;
        itemName = itemName || resource.charAt(0).toUpperCase() + resource.slice(1); //User
        itemsName = itemsName || `${itemName}s`; //Users
        const resourcesName = itemsName.toLowerCase(); //users
        this.names = {itemName, itemsName, resourcesName};
        this.gateway = gateway;
        this.useService = this.useService.bind(this);
        this.actions = {
            [`fetch${itemsName}`]: this.fetchItems.bind(this),
            [`refetch${itemsName}`]: (silent) => this.fetchItems(this.fetchPayload, silent),
            [`add${itemName}`]: this.addItem.bind(this),
            [`edit${itemName}`]: this.editItem.bind(this),
            [`create${itemName}`]: this.createItem.bind(this),
            [`read${itemName}`]: this.readItem.bind(this),
            [`update${itemName}`]: this.updateItem.bind(this),
            [`delete${itemName}`]: this.deleteItem.bind(this),
            [`undo${itemName}`]: this.undoItem.bind(this),
            afterChange: this.afterChangeItem.bind(this),
            mode: this.mode,
        }
    }

    useService() {
        const [state] = useGlobalState(this.resource);
        const {itemName, itemsName, resourcesName} = this.names;
        this.state = {
            ...state,
            [resourcesName]: state.items,
            [`has${itemsName}`]: state.hasItems,
            [`current${itemName}`]: state.currentItem,
            [`undo${itemName}Exists`]: state.undoItem !== null,
            ...this.actions
        }
        return this.state;
    }

    async fetchItems(payload, silent) {
        if (!silent) {
            dispatch({type: "fetching"});
        }
        try {
            const response = await this.fetchData(payload);
            this.fetchPayload = payload;
            dispatch({type: "fetched", items: response.data});
        } catch (e) {
            this.reportError(e);
        }
    }

    fetchData(payload) {
        return this.gateway.fetchItem(payload);
    }

    async addItem() {
        this.mode.setAdd();
    }

    async editItem(id, payload) {
        await this.readItem(id, payload);
        this.mode.setEdit();
    }

    async createItem(payload) {
        dispatch({type: "creating"});
        try {
            const response = await this.createData(payload);
            dispatch({type: "created", item: response.data, payload: payload});
            this.afterChangeItem("created");
        } catch (e) {
            this.reportError(e);
        }
    }

    createData(payload) {
        return this.gateway.createItem(payload);
    }

    async readItem(id, payload) {
        dispatch({type: "reading", id});
        try {
            const response = await this.readData(id, payload);
            dispatch({type: "read", id, item: response.data});
        } catch (e) {
            this.reportError(e);
        }
    }

    readData(id, payload) {
        return this.gateway.readItem(id, payload);
    }

    async updateItem(id, payload) {
        dispatch({type: "updating"});
        try {
            const response = await this.updateData(id, payload);
            dispatch({type: "updated", id, item: response.data, payload: payload});
            this.afterChangeItem("updated");
        } catch (e) {
            this.reportError(e);
        }
    }

    updateData(id, payload) {
        return this.gateway.updateItem(id, payload);
    }

    async deleteItem(id, payload) {
        dispatch({type: "deleting", id});
        try {
            const response = await this.deleteData(id, payload);
            dispatch({type: "deleted", id, item: response.data, payload: payload});
            this.afterChangeItem("deleted");
        } catch (e) {
            this.reportError(e);
        }
    }

    deleteData(id, payload) {
        return this.gateway.deleteItem(id, payload);
    }

    afterChangeItem(eventType) {}


    undoItem() {
        const {restoreType, id, item, origPayload} = this.state.undoItem;
        const payload = {...origPayload, body: item};
        return (restoreType === "createItem")?
            this[restoreType](payload) : this[restoreType](id, payload);
    }

    mode = {
        isAdd: () => this.state.modeType === "add",
        setAdd: () => dispatch({type: "mode", mode: "add"}),
        isEdit: () => this.state.modeType === "edit",
        setEdit: () => dispatch({type: "mode", mode: "edit"}),
        isInitial: () => this.state.modeType === "initial",
        setInitial: () => dispatch({type: "mode", mode: "initial"}),
    }

    reportError(e) {
        const message = e.message || "unknown error";
        const statusText = (e && e.response && e.response.statusText) || "";
        const detailedMessage = (e && e.response)? JSON.stringify(e.response) : message;
        dispatch({type: "error", error: `${message} ${statusText}`});
        console.error("Error:", detailedMessage);
        console.error(e && e.stack);
    }
}
