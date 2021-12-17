import { NextRouter, withRouter } from 'next/router';
import NextLink from 'next/link';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { 
    editUserDetails
} from '../../redux/user/actions';
import {
    Alert,
    setAlerts
} from '../../redux/alerts/actions';

import axios from 'axios';

import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const SmallButton = styled(Button)(({ theme }) => ({
    width: '100px',
    textTransform: 'none'
}));

type AccountSecurityProps = {
    dispatchSetAlerts: (alerts: Alert[]) => void;
}

type AccountSecurityState = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

class AccountSecurity extends React.Component<AccountSecurityProps, AccountSecurityState> {
    constructor(props) {
        super(props);

        this.submitChangePassword = this.submitChangePassword.bind(this);

        this.state = {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        }
    }

    async submitChangePassword() {
        const { dispatchSetAlerts } = this.props;
        const { 
            currentPassword,
            newPassword,
            confirmNewPassword
        } = this.state;

        axios.post(`/api/user/change-password`, {
            currentPassword,
            newPassword,
            confirmNewPassword
        }, { withCredentials: true })
        .then((res: any) => {
            dispatchSetAlerts([{ type: 'success', message: res.data.message }]);
        }).catch((err) => {
            dispatchSetAlerts(
                err.response.errors.map((error) => ({ type: 'error', message: error }))
            );
        });
    }

    render() {
        const { 
            currentPassword,
            newPassword,
            confirmNewPassword
        } = this.state;

        return (
            <Box margin="30px 0">
                <Stack spacing={5} direction="column">
                    <Paper sx={{ padding: '20px 30px' }} elevation={3}>
                        <Box display="grid" gridTemplateColumns="25% 75%">
                            <Typography
                                variant="h5"
                            >
                                Change password
                            </Typography>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Current password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => this.setState({ currentPassword: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    label="New password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => this.setState({ newPassword: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    label="Confirm new password"
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) => this.setState({ confirmNewPassword: e.target.value })}
                                />
                                <SmallButton
                                    variant="contained"
                                    sx={{ marginTop: '30px !important'}}
                                    onClick={this.submitChangePassword}
                                >
                                    Save
                                </SmallButton>
                            </Stack>
                        </Box>
                    </Paper>
                </Stack>
            </Box>
        )
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetAlerts: (alerts: Alert[]) => dispatch(setAlerts(alerts))
})

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(AccountSecurity);