import React, {useState, useEffect} from 'react';
import TextField from "@material-ui/core/TextField";
import Box from '@material-ui/core/Box';
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';


const UserEditForm = ({currentUser, updateUser, onCancel}) => {
    const [user, setUser] = useState(currentUser)

    useEffect(
        () => {
            setUser(currentUser)
        },
        [ currentUser ]
    )

    const handleInputChange = event => {
        const {name, value} = event.target
        setUser({...user, [name]: value})
    }
    return (
        <Box display="flex" css={{paddingTop: 8, paddingLeft: 16, paddingRight: 16,}} flexDirection="column" bgcolor="background.paper" component={Paper}>
            <Box p={1} flexGrow={1}>
                <h3>Edit user</h3>
            </Box>
            <form
                onSubmit={event => {
                    event.preventDefault()
                    if (user.firstName && user.lastName && user.username) {
                        const {id} = user;
                        const data = {...user};
                        const payload = {id, data};
                        updateUser(id, payload)
                    }
                }}
            >
                <TextField
                    id="firstName"
                    label="First name"
                    fullWidth
                    autoFocus={true}
                    name="firstName"
                    margin="normal"
                    onChange={handleInputChange}
                    value={user.firstName}
                />
                <TextField
                    id="lastName"
                    label="Last name"
                    fullWidth
                    name="lastName"
                    margin="normal"
                    onChange={handleInputChange}
                    value={user.lastName}
                />
                <TextField
                    id="outlined-email-input-required"
                    label="User name"
                    fullWidth
                    name="username"
                    margin="normal"
                    onChange={handleInputChange}
                    value={user.username}
                />
                <Box display="flex" alignItems="center" css={{height: 100}}>
                    <Box p={1}>
                        <Button variant="contained" color="primary" type="submit">Save</Button>
                        <Button color="default" onClick={onCancel}>Cancel</Button>
                    </Box>
                </Box>
            </form>
        </Box>
    )
}

export default UserEditForm