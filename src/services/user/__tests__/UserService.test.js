import {renderHook, act} from '@testing-library/react-hooks';
import nock from "nock";
import useUserService, {userService} from "../UserService";
import sampleUsers from "./users.json";

describe('User Service', () => {

    beforeEach(() => {
        const scope = nock("http://localhost:5000")
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .get('/users')
            .replyWithFile(200, __dirname + "/users.json", {
                'Content-Type': 'application/json'
            })
    });

    afterEach(() => {
        nock.cleanAll()
        nock.enableNetConnect()
    });

    test("should fetch users", async () => {
        const { result, waitForNextUpdate } = renderHook(() => useUserService());
        act(() => {
            result.current.fetchUsers();
        })
        expect(result.current.fetching).toBe(true);
        await waitForNextUpdate();
        expect(result.current.fetching).toBe(false);
        expect(result.current.users).toEqual(sampleUsers)
    });

    test("should generate correct unique user name", async () => {
        const username = await userService.generateUsername("brownb");
        expect(username).toBe("brownb");
    })

    test("should generate correct duplicate user name", async () => {
        const username = await userService.generateUsername("hiltonp", 0);
        expect(username).toBe("hiltonp2");
    })

    test("should generate the same user name excluding same record", async () => {
        const username = await userService.generateUsername("hiltonp", 7);
        expect(username).toBe("hiltonp");
    })

    test("should generate correct user name when multiple", async () => {
        const username = await userService.generateUsername("smithd");
        expect(username).toBe("smithd4");
    })

    test("should generate correct user name when multiple with gap", async () => {
        const username = await userService.generateUsername("jonesj");
        expect(username).toBe("jonesj2");
    })

});