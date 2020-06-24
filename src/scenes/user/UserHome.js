import React, {useEffect} from "react";
import Box from '@material-ui/core/Box';
import useUserService from "../../services/user/UserService";
import UserTable from "./UserTable";
import UserAdd from "./UserAdd";
import UserEdit from "./UserEdit";

export default function List(props) {
    const {
        mode, fetchUsers, fetching, hasUsers, completed, addUser, editUser,
        createUser, updateUser, deleteUser, users, currentUser, error
    } = useUserService();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const onCancel = () => mode.setInitial();

    if (error) {
        return <div>Error: {error}, please reload</div>;
    }
    if (fetching) {
        return <div>Loading...</div>;
    }
    if (completed && !hasUsers) {
        return <div>No users found</div>;
    }

    return (
        <Box display="flex" p={1} bgcolor="background.paper">
            <Box p={1} flex={1}>
                <UserTable
                    users={users} addUser={addUser} editUser={editUser} deleteUser={deleteUser}
                />
            </Box>
            <Box p={1} flex={1}>
                {mode.isAdd() && <UserAdd createUser={createUser} onCancel={onCancel}></UserAdd>}
                {mode.isEdit() && <UserEdit
                    currentUser={currentUser} updateUser={updateUser} onCancel={onCancel}>
                </UserEdit>}
            </Box>
        </Box>
    );
}
