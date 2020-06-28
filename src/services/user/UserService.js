import RestService from "../common/RestService";
import UserGateway from "./UserGateway";

class UserService extends RestService {

    async createItem(options) {
        const {body: user} = options;
        /* Username = (last name + first name initial) without special chars eg. obriena */
        const candidate = user.username ||
            `${user.lastName.toLowerCase()}${user.firstName.charAt(0).toLowerCase()}`
                .replace(/[^a-zA-Z0-9]/g, "");
        user.username = await this.getUniqueUsername(candidate);
        return super.createItem(options);
    }

    // todo: Validate in form on submit
    async updateItem(id, options) {
        const {body: user} = options;
        const candidate = user.username;
        const username = await this.getUniqueUsername(candidate, id);
        if (candidate !== username) {
            throw new Error(`'${candidate}' user name already exists. Try '${username}' instead`)
        }
        return super.updateItem(id, options);
    }

    /* If not unique then add number suffix eg. smithd2 */
    async getUniqueUsername(candidate, excludeId) {
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
        //this.actions.refetchUsers();
    }

    onCancel() {
        this.mode.setInitial();
    }
}

const userGateway = new UserGateway();
export const userService = new UserService("user", userGateway);
const {useService: useUserService} = userService
export default useUserService;

