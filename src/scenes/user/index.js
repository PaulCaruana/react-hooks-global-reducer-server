import React from "react";
import Box from '@material-ui/core/Box';
import useUserService from "../../services/user/UserService";
import UserList from "./UserList";
import UserAdd from "./UserAdd";
import UserEdit from "./UserEdit";

export default function List(props) {
    const {
        refetchUsers, fetching, hasUsers, completed, addUser, editUser, createUser, mode,
        updateUser, deleteUser, undoUser, undoUserExists, users, currentUser, onCancel, error
    } = useUserService("onLoadFetch");

    if (error) {
        return <div>Error: {error}, please reload</div>;
    }
    if (fetching) {
        return <div>Loading...</div>;
    }

    return (
        <Box display="flex" p={1} bgcolor="background.paper">
            <Box p={1} flex={1}>
                <UserList
                    users={users}
                    refetchUsers={refetchUsers}
                    addUser={addUser}
                    editUser={editUser}
                    deleteUser={deleteUser}
                    undoUser={undoUserExists && undoUser}
                    hasUsers={!completed || hasUsers}
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
