import React from 'react';
import axios from 'axios';

import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SmallButton = styled(Button)(({ theme }) => ({
    width: '100px',
    textTransform: 'none'
}));

type AccountGeneralProps = {
    user: any;
}

type AccountGeneralState = {
    firstName: string;
    lastName: string;
    email: string;
}

class AccountGeneral extends React.Component<AccountGeneralProps, AccountGeneralState> {
    constructor(props) {
        super(props);

        this.submitEditUserDetails = this.submitEditUserDetails.bind(this);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
        }
    }

    async submitEditUserDetails() {
        const { user } = this.props;
        const {
            firstName,
            lastName,
            email
        } = this.state;

        const res = await axios.patch(`/api/user/edit`, {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            email: email || user.email
        }, { withCredentials: true });

        console.log(res.data)
    }

    render() {
        const { user } = this.props;

        return (
            <Box marginTop="30px">
                <Stack spacing={5} direction="column">
                    <Paper sx={{ padding: '20px 30px' }} elevation={3}>
                        <Box display="grid" gridTemplateColumns="25% 75%">
                            <Typography
                                variant="h5"
                            >
                                Delete Account
                            </Typography>
                            <Typography
                                variant="body1"
                            >
                                Delete all projects created by you and their data within.
                            </Typography>
                            <Stack spacing={2} direction="column">
                                <Stack spacing={2} direction="row">
                                    <TextField
                                        fullWidth
                                        label="First name"
                                        defaultValue={user.firstName}
                                        onChange={(e) => this.setState({ firstName: e.target.value })}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Last name"
                                        defaultValue={user.lastName}
                                        onChange={(e) => this.setState({ lastName: e.target.value })}
                                    />
                                </Stack>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    defaultValue={user.email}
                                    onChange={(e) => this.setState({ email: e.target.value })}
                                />
                                <SmallButton
                                    variant="contained"
                                    sx={{ marginTop: '30px !important'}}
                                    onClick={this.submitEditUserDetails}
                                >
                                    Save
                                </SmallButton>
                            </Stack>
                        </Box>
                    </Paper>
                    <Paper sx={{ padding: '20px 30px' }} elevation={3}>
                        <Box>
                            <Typography
                                variant="h5"
                            >
                                Details
                            </Typography>
                        </Box>
                    </Paper>
                </Stack>
            </Box>
        )
    }
}

export default AccountGeneral;