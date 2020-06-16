import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import Box from '@material-ui/core/Box';
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';


const UserAddForm = ({createUser, onCancel}) => {
    const initialFormState = {id: null, firstName: '', lastName: ''}
    const [user, setUser] = useState(initialFormState)

    const handleInputChange = event => {
        const {name, value} = event.target
        setUser({...user, [name]: value})
    }



    return (
        <Box display="flex" css={{paddingTop: 8, paddingLeft: 16, paddingRight: 16,}} flexDirection="column" bgcolor="background.paper" component={Paper}>
            <Box p={1} flexGrow={1}>
                <h3>Add user</h3>
            </Box>
            <form
                onSubmit={event => {
                    event.preventDefault()
                    if (user.firstName && user.lastName) {
                        const payload = {data: user};
                        createUser(payload)
                        setUser(initialFormState)
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

export default UserAddForm