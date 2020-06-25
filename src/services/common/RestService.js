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
            [`fetch${itemsName}`]: this.doFetch.bind(this),
            [`refetch${itemsName}`]: (silent) => this.doFetch(this.fetchPayload, silent),
            [`add${itemName}`]: this.toAddMode.bind(this),
            [`edit${itemName}`]: this.toEditMode.bind(this),
            [`create${itemName}`]: this.onCreate.bind(this),
            [`read${itemName}`]: this.onRead.bind(this),
            [`update${itemName}`]: this.onUpdate.bind(this),
            [`delete${itemName}`]: this.onDelete.bind(this),
            [`undo${itemName}`]: this.onUndo.bind(this),
            afterChange: this.onAfterChange.bind(this),
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

    async doFetch(payload, silent) {
        if (!silent) {
            dispatch({type: "fetching"});
        }
        try {
            const response = await this.fetchData(payload);
            this.fetchPayload = payload;
            dispatch({type: "fetched", items: response.data});
        } catch (e) {
            this.onError(e);
        }
    }

    fetchData(payload) {
        return this.gateway.fetchItems(payload);
    }

    async toAddMode() {
        this.mode.setAdd();
    }

    async toEditMode(id, payload) {
        await this.onRead(id, payload);
        this.mode.setEdit();
    }

    async onCreate(payload) {
        dispatch({type: "creating"});
        try {
            const response = await this.createData(payload);
            dispatch({type: "created", item: response.data, payload: payload});
            this.onAfterChange("created");
        } catch (e) {
            this.onError(e);
        }
    }

    createData(payload) {
        return this.gateway.createItem(payload);
    }

    async onRead(id, payload) {
        dispatch({type: "reading", id});
        try {
            const response = await this.readData(id, payload);
            dispatch({type: "read", id, item: response.data});
        } catch (e) {
            this.onError(e);
        }
    }

    readData(id, payload) {
        return this.gateway.readItem(id, payload);
    }

    async onUpdate(id, payload) {
        dispatch({type: "updating"});
        try {
            const response = await this.updateData(id, payload);
            dispatch({type: "updated", id, item: response.data, payload: payload});
            this.onAfterChange("updated");
        } catch (e) {
            this.onError(e);
        }
    }

    updateData(id, payload) {
        return this.gateway.updateItem(id, payload);
    }

    async onDelete(id, payload) {
        dispatch({type: "deleting", id});
        try {
            const response = await this.deleteData(id, payload);
            dispatch({type: "deleted", id, item: response.data, payload: payload});
            this.onAfterChange("deleted");
        } catch (e) {
            this.onError(e);
        }
    }

    deleteData(id, payload) {
        return this.gateway.deleteItem(id, payload);
    }

    onAfterChange(eventType) {}


    onUndo() {
        const {restoreType, id, item, origPayload} = this.state.undoItem;
        const payload = {...origPayload, body: item};
        return (restoreType === "onCreate")?
            this[restoreType](payload) : this[restoreType](id, payload);
    }

    mode = {
        isAdd: () => this.state.currentMode === "add",
        setAdd: () => dispatch({type: "mode", mode: "add"}),
        isEdit: () => this.state.currentMode === "edit",
        setEdit: () => dispatch({type: "mode", mode: "edit"}),
        isInitial: () => this.state.currentMode === "initial",
        setInitial: () => dispatch({type: "mode", mode: "initial"}),
    }

    onError(e) {
        const message = e.message || "unknown error";
        const statusText = (e && e.response && e.response.statusText) || "";
        const detailedMessage = (e && e.response)? JSON.stringify(e.response) : message;
        dispatch({type: "error", error: `${message} ${statusText}`});
        console.error("Error:", detailedMessage);
        console.error(e && e.stack);
    }
}
