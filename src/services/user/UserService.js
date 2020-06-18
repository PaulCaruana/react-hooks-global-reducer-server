import RestService from "../common/RestService";
import RestGateway from "../common/RestGateway";

class UserService extends RestService {

    async createData(options) {
        const {data: user} = options;
        const candidate = `${user.lastName.toLowerCase()}${user.firstName.charAt(0).toLowerCase()}`;
        user.username = await this.generateUsername(candidate);
        return super.createData(options);
    }


    async updateData(id, options) {
        const {data: user} = options;
        const candidate = user.username;
        const username = await this.generateUsername(candidate);
        if (candidate !== username) {
            throw new Error(`'${candidate}' user name already exists. Try '${username}' instead`)
        }
        return super.updateData(id, options);
    }


    async generateUsername(candidate) {
        const response = await this.fetchData();
        const users = response.data;
        const matchingUsers = users.filter((user) => user.username.startsWith(candidate));
        if (matchingUsers.length === 0) {
            return candidate;
        }
        const matchingUsernames = matchingUsers.map((user) => user.username);
        let cnt = 1;
        let username = candidate;
        while (matchingUsernames.indexOf(username) > -1) {
            cnt++;
            username = candidate + cnt;
        }
        return username;
    }

    afterChange(eventType) {
        this.mode.setInitial();
        this.actions.refetchUsers();
    }
}

const host = process.env.REACT_APP_SERVER_ENDPOINT || "http://localhost:5000";
const userGateway = RestGateway(`${host}/users`);
export const userService = new UserService("user", userGateway);
const {useService : useUserService} = userService
export default useUserService;

