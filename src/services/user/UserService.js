import RestService from "../common/RestService";
import RestGateway from "../common/RestGateway";

class UserService extends RestService {

    async createData(options) {
        const {body: user} = options;
        const candidate = user.username ||
            `${user.lastName.toLowerCase()}${user.firstName.charAt(0).toLowerCase()}`;
        user.username = await this.generateUsername(candidate);
        return super.createData(options);
    }


    async updateData(id, options) {
        const {body: user} = options;
        const candidate = user.username;
        const username = await this.generateUsername(candidate, id);
        if (candidate !== username) {
            throw new Error(`'${candidate}' user name already exists. Try '${username}' instead`)
        }
        return super.updateData(id, options);
    }


    async generateUsername(candidate, excludeId) {
        const response = await this.fetchData();
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

    afterChangeItem(eventType) {
        this.mode.setInitial();
        if (eventType !== "deleted") {
            this.actions.refetchUsers();
        }
    }
}

const host = process.env.REACT_APP_SERVER_ENDPOINT || "http://localhost:5000";
const userGateway = RestGateway(`${host}/users`);
export const userService = new UserService("user", userGateway);
const {useService: useUserService} = userService
export default useUserService;

