const restReducer = (key = "id") => {
    const initialState = {
        fetching: false,
        creating: false,
        reading: false,
        updating: false,
        deleting: false,
        completed: false,
        mode: false,
        items: [],
        error: null
    }

    const isMatch = (item, id) => {
        if (id === undefined) {
            throw new Error("Action must contain id");
        }
        const itemId = item[key];
        if (itemId === undefined) {
            throw new Error("Item key not found");
        }
        return itemId.toString() === id.toString();
    };

    const findItem = (items, id) => {
        return items.find(current => isMatch(current, id));
    }

    const deleteItem = (items, id) => {
        const deleteIndex = items.findIndex(current => isMatch(current, id));
        if (deleteIndex === -1) {
            return items;
        }
        const results = [
            ...items.slice(0, deleteIndex),
            ...items.slice(deleteIndex + 1)
        ];
        return results;
    };

    const loadUndoItem = (eventType, id, item, payload) => {
        const restoreTypes = {
            created: "deleteItem",
            updated: "updateItem",
            deleted: "createItem"
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

    const reducer = (state = initialState, action) => {
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
                modeType: action.mode,
            }
        case "selected" :
            return {
                ...state,
                selected: currentItems.find(current => isMatch(current, id)),
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
                undoItem: loadUndoItem("created", item[key], item, payload),
                currentItem: item,
                creating: false,
                completed: true,
            }
        case "reading":
            return {
                ...baseState,
                currentItem: currentItems.find(current => (isMatch(current, id) ? item : current)),
                reading: true,
            }
        case "read":
            return {
                ...baseState,
                items: currentItems.map(current => (isMatch(current, id) ? item : current)),
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
                items: currentItems.map(current => (isMatch(current, id) ? item : current)),
                undoItem: loadUndoItem("updated", id, item, payload),
                currentItem: item,
                updating: false,
                completed: true,
            };
        case "deleting":
            return {
                ...baseState,
                undoItem: loadUndoItem("deleted", id, findItem(currentItems, id), payload),
                items: deleteItem(currentItems, id),
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
                ...initialState,
                error
            }
        default:
            return state;
        }

    }

    return {reducer, initialState};
}
export default restReducer;