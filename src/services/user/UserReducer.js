import RestReducer from "../common/RestReducer";

export default class UserService extends RestReducer {
    constructor() {
        super("id")
    }
}