export default class RestReducer {
    constructor(key) {
        this.key = key;
        this.isMatch = this.isMatch.bind(this);
        this.getItemValue = this.getItemValue.bind(this);
        this.findItem = this.findItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.loadUndoItem = this.loadUndoItem.bind(this);
        this.reducer = this.reducer.bind(this);
        this.initialState = {
            fetching: false,
            creating: false,
            reading: false,
            updating: false,
            deleting: false,
            completed: false,
            currentMode: false,
            items: [],
            undoItem: null,
            error: null
        }
    }

    isMatch(item, id) {
        if (id === undefined) {
            throw new Error("Action must contain id");
        }
        const itemId = this.getItemValue(item);
        if (itemId === undefined) {
            throw new Error("Item key not found");
        }
        return itemId.toString() === id.toString();
    }

    getItemValue(item) {
        return item[this.key];
    }

    findItem(items, id) {
        return items.find(current => this.isMatch(current, id));
    }

    deleteItem(items, id) {
        const deleteIndex = items.findIndex(current => this.isMatch(current, id));
        if (deleteIndex === -1) {
            return items;
        }
        const results = [
            ...items.slice(0, deleteIndex),
            ...items.slice(deleteIndex + 1)
        ];
        return results;
    }

    loadUndoItem(eventType, id, item, payload) {
        const restoreTypes = {
            created: "onDelete",
            updated: "onUpdate",
            deleted: "onCreate"
        };
        const origPayload = payload || {};
        return {
            eventType,
            restoreType: restoreTypes[eventType],
            id,
            item,
            origPayload
        };
    }

    reducer(state = this.initialState, action) {
        const {type, items: nextItems, id, item, payload, error} = action;
        const {items: currentItems} = state;
        const baseState = {...state, completed: false, error: null}
        switch (type) {
        case "fetching" :
            return {
                ...baseState,
                hasItems: currentItems && currentItems.length > 0,
                currentItem: null,
                fetching: true
            }
        case "fetched" :
            return {
                ...baseState,
                items: [...nextItems],
                hasItems: nextItems && nextItems.length > 0,
                fetching: false,
                completed: true,
            }
        case "mode" :
            return {
                ...state,
                currentMode: action.mode,
            }
        case "selected" :
            return {
                ...state,
                selected: currentItems.find(current => this.isMatch(current, id)),
            }
        case "clearSelected" :
            return {
                ...state,
                selected: null,
            }
        case "creating":
            return {
                ...baseState,
                creating: true,
            }
        case "created":
            return {
                ...baseState,
                items: [
                    item,
                    ...currentItems,
                ],
                hasItems: true,
                undoItem: this.loadUndoItem("created", this.getItemValue(item), item, payload),
                currentItem: item,
                creating: false,
                completed: true,
            }
        case "reading":
            return {
                ...baseState,
                currentItem: currentItems.find(current => (this.isMatch(current, id) ? item : current)),
                reading: true,
            }
        case "read":
            return {
                ...baseState,
                items: currentItems.map(current => (this.isMatch(current, id) ? item : current)),
                currentItem: item,
                reading: false,
                completed: true,
            }
        case "updating":
            return {
                ...baseState,
                updating: true,
            };
        case "updated":
            return {
                ...baseState,
                undoItem: this.loadUndoItem("updated", id, this.findItem(currentItems, id), payload),
                items: currentItems.map(current => (this.isMatch(current, id) ? item : current)),
                currentItem: item,
                updating: false,
                completed: true,
            };
        case "deleting":
            return {
                ...baseState,
                undoItem: this.loadUndoItem("deleted", id, this.findItem(currentItems, id), payload),
                items: this.deleteItem(currentItems, id),
                get hasItems() {return this.items && this.items.length > 0},
                deleting: true,
            };
        case "deleted":
            return {
                ...baseState,
                deleting: false,
                completed: true,
            };
        case "error" :
            return {
                ...this.initialState(),
                error
            }
        default:
            return state;
        }
    }
}