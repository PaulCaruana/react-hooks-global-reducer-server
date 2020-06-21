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
            [`refetch${itemsName}`]: () => this.fetchItems(this.fetchOptions),
            [`add${itemName}`]: this.addItem.bind(this),
            [`edit${itemName}`]: this.editItem.bind(this),
            [`create${itemName}`]: this.createItem.bind(this),
            [`read${itemName}`]: this.readItem.bind(this),
            [`update${itemName}`]: this.updateItem.bind(this),
            [`delete${itemName}`]: this.deleteItem.bind(this),
            afterChange: this.afterChange.bind(this),
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
            ...this.actions
        }
        console.log(this.state)
        return this.state;
    }

    async fetchItems(options) {
        dispatch({type: "fetching"});
        try {
            const response = await this.fetchData(options);
            this.fetchOptions = options;
            dispatch({type: "fetched", items: response.data});
        } catch (e) {
            this.reportError(e);
        }
    }

    fetchData(options) {
        return this.gateway.fetchItem(options);
    }

    async addItem() {
        this.mode.setAdd();
    }

    async editItem(id, options) {
        await this.readItem(id, options);
        this.mode.setEdit();
    }

    async createItem(options) {
        dispatch({type: "creating"});
        try {
            const response = await this.createData(options);
            dispatch({type: "created", item: response.data});
            this.afterChange("created");
        } catch (e) {
            this.reportError(e);
        }
    }

    createData(options) {
        return this.gateway.createItem(options);
    }

    async updateItem(id, options) {
        dispatch({type: "updating"});
        try {
            const response = await this.updateData(id, options);
            dispatch({type: "updated", id, item: response.data});
            this.afterChange("updated");
        } catch (e) {
            this.reportError(e);
        }
    }

    async readItem(id, options) {
        dispatch({type: "reading"});
        try {
            const response = await this.readData(id, options);
            dispatch({type: "read", id, item: response.data});
        } catch (e) {
            this.reportError(e);
        }
    }

    readData(id, options) {
        return this.gateway.readItem(id, options);
    }

    updateData(id, options) {
        return this.gateway.updateItem(id, options);
    }

    async deleteItem(id, options) {
        dispatch({type: "deleting"});
        try {
            const response = await this.deleteData(id, options);
            dispatch({type: "deleted", id, item: response.data});
            this.afterChange("deleted");
        } catch (e) {
            this.reportError(e);
        }
    }

    deleteData(id, options) {
        return this.gateway.deleteItem(id, options);
    }

    afterChange(eventType) {
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
