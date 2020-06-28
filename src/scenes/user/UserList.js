import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Add from "@material-ui/icons/Add";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Undo from "@material-ui/icons/Undo";
import Refresh from "@material-ui/icons/Refresh";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from "@material-ui/core/IconButton";
import { CircularProgress } from '@material-ui/core';


const useStyles = makeStyles({
    table: {
        width: "100%"
    },
});

const UserList = ({
        users, refetchUsers, addUser, editUser, deleteUser, undoUser, hasUsers, completed
    }) => {
    const classes = useStyles();
    const title = (hasUsers)? "Users" : "No users found";

    return (
        <TableContainer className={classes.table} component={Paper}>
            <Box display="flex" p={1} bgcolor="background.paper" >
                <Box p={1} flexGrow={1}>
                    <h3>{title}</h3>
                </Box>
                <Box p={1} alignSelf="center">
                    <Tooltip title={"Refresh users"} aria-label="refresh">
                        <IconButton color="primary" onClick={refetchUsers} disabled={!completed}>
                            {!completed && <CircularProgress size={18} thickness={5} variant="indeterminate" disableShrink={true}/>}
                            {completed && <Refresh/>}
                        </IconButton>
                    </Tooltip>
                    {undoUser && <Tooltip title="Undo last change" aria-label="undo">
                        <IconButton color="primary" onClick={undoUser}><Undo/></IconButton>
                    </Tooltip>}
                    <Tooltip title="Add user" aria-label="add">
                        <IconButton color="primary" onClick={addUser}><Add/></IconButton>
                    </Tooltip>
                </Box>
            </Box>
            {hasUsers && <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell><b>Remove</b></TableCell>
                        <TableCell><b>Edit</b></TableCell>
                        <TableCell><b>First name</b></TableCell>
                        <TableCell><b>Last name</b></TableCell>
                        <TableCell><b>User name</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell align="left" padding="checkbox">
                                <IconButton  onClick={() => deleteUser(user.id)}><Delete/></IconButton>
                            </TableCell>
                            <TableCell align="left" padding="checkbox">
                                <IconButton  onClick={() => editUser(user.id)}><Edit/></IconButton>
                            </TableCell>
                            <TableCell component="th" scope="row">{user.firstName}</TableCell>
                            <TableCell component="th" scope="row">{user.lastName}</TableCell>
                            <TableCell>{user.username}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>}
        </TableContainer>
    );
};

export default UserList