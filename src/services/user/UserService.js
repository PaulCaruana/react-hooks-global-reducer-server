import RestService from "../common/RestService";
import RestGateway from "../common/RestGateway";

class UserService extends RestService {

    async createItem(options) {
        const {body: user} = options;
        const candidate = user.username ||
            `${user.lastName.toLowerCase()}${user.firstName.charAt(0).toLowerCase()}`
                .replace(/[^a-zA-Z0-9]/g, "");
        user.username = await this.generateUsername(candidate);
        return super.createItem(options);
    }


    async updateItem(id, options) {
        const {body: user} = options;
        const candidate = user.username;
        const username = await this.generateUsername(candidate, id);
        if (candidate !== username) {
            throw new Error(`'${candidate}' user name already exists. Try '${username}' instead`)
        }
        return super.updateItem(id, options);
    }

    /* Username = unique (last name + first name initial) */
    async generateUsername(candidate, excludeId) {
        const response = await super.fetchItems();
        const users = response.data;
        let found = users.some((user) =>
            user.username === candidate && user.id !== excludeId
        );
        if (!found) {
            return candidate;
        }
        let cnt = 1;
        for (let i = 0; found; i++) {
            cnt++;
            const username = candidate + cnt;
            found = users.some((user) =>
                user.username === username && user.id !== excludeId
            );
        }
        return candidate + cnt;
    }

    onAfterChange(eventType) {
        this.mode.setInitial();
        if (eventType !== "deleted") {
            this.actions.refetchUsers();
        }
    }
}

const host = process.env.REACT_APP_SERVER_ENDPOINT || "http://localhost:5000";
const sortByUpdatedAt = (users) => users.sort((a, b) => b.updatedAt - a.updatedAt);
const userGateway = RestGateway(`${host}/users`, true, sortByUpdatedAt);

export const userService = new UserService("user", userGateway);
const {useService: useUserService} = userService
export default useUserService;

