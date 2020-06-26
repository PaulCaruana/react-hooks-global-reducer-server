import {renderHook, act} from '@testing-library/react-hooks';
import nock from "nock";
import useUserService, {userService} from "../UserService";
import sampleUsers from "./users.json";

describe('User Service', () => {

    beforeEach(() => {
        nock("http://localhost:5000")
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .get('/users')
            .replyWithFile(200, __dirname + "/users.json", {
                'Content-Type': 'application/json'
            })
        nock("http://localhost:5000")
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .post('/users')
            .reply(200, (uri, requestBody) => requestBody, {
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
        const username = await userService.getUniqueUsername("brownb");
        expect(username).toBe("brownb");
    })

    test("should generate correct duplicate user name", async () => {
        const username = await userService.getUniqueUsername("hiltonp", 0);
        expect(username).toBe("hiltonp2");
    })

    test("should generate the same user name excluding same record", async () => {
        const username = await userService.getUniqueUsername("hiltonp", 7);
        expect(username).toBe("hiltonp");
    })

    test("should generate correct user name when multiple", async () => {
        const username = await userService.getUniqueUsername("smithd");
        expect(username).toBe("smithd4");
    })

    test("should generate correct user name when multiple with gap", async () => {
        const username = await userService.getUniqueUsername("jonesj");
        expect(username).toBe("jonesj2");
    })

    test("should create data with the correct username", async () => {
        const user = {
            firstName: "Fred",
            lastName: "O'Brien-Henley II"
        }
        const payload = {
            body: user
        }
        const response = await userService.createItem(payload);
        const createdUser = response.data;
        expect(createdUser.username).toBe("obrienhenleyiif");
    })

    test("should create data with the correct username when duplicate", async () => {
        const user = {
            firstName: "Julie",
            lastName: "Jones"
        }
        const payload = {
            body: user
        }
        const response = await userService.createItem(payload);
        const createdUser = response.data;
        expect(createdUser.username).toBe("jonesj2");
    })

});