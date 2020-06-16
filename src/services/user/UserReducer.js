export const initialState = {
    fetchingUsers: false,
    creatingUser: false,
    readingUser: false,
    updatingUser: false,
    deletingUser: false,
    completed: false,
    mode: false,
    users: [],
    error: null
}

const isMatch = (item, id) => {
    if (id === undefined) {
        throw new Error("Action must contain id");
    }
    const itemId = item.id;
    if (itemId === undefined) {
        throw new Error("Item key not found");
    }
    return itemId.toString() === id.toString();
};

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

const reducer = (state = initialState, action) => {
    const {type, users: nextUsers, id, user, error} = action;
    const {users: currentUsers} = state;
    const baseState = {...state, completed: false,  error: null}
    switch (type) {
    case "fetching" :
        return {
            ...baseState,
            currentUser: null,
            fetchingUsers: true
        }
    case "fetched" :
        return {
            ...baseState,
            users: [...nextUsers],
            hasUsers: nextUsers && nextUsers.length > 0,
            fetchingUsers: false,
            completed: true,
        }
    case "mode" :
        return {
            ...state,
            mode: action.mode,
        }
    case "selected" :
        return {
            ...state,
            selected: currentUsers.find(current => isMatch(current, id)),
        }
    case "clearSelected" :
        return {
            ...state,
            selected: null,
        }
    case "creating":
        return {
            ...baseState,
            creatingUser: true,
        }
    case "created":
        return {
            ...baseState,
            users: [
                user,
                ...currentUsers,
            ],
            hasUsers: true,
            currentUser: user,
            creatingUser: false,
            completed: true,
        }
    case "reading":
        return {
            ...baseState,
            readingUser: true,
        }
    case "read":
        return {
            ...baseState,
            users: currentUsers.map(current => (isMatch(current, id)? user : current)),
            currentUser: user,
            readingUser: false,
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
            users: currentUsers.map(current => (isMatch(current, id)? user : current)),
            currentUser: user,
            updating: false,
            completed: true,
        };
    case "deleting":
        return {
            ...baseState,
            deleting: true,
        };
    case "deleted":
        return {
            ...baseState,
            users: deleteItem(currentUsers, id),
            currentUser: null,
            hasUsers: currentUsers && currentUsers.length > 1,
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

export default reducer;