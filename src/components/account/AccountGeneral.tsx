import { NextRouter, withRouter } from 'next/router';
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

const SmallButton = styled(Button)(({ theme }) => ({
    width: '100px',
    textTransform: 'none'
}));

const ErrorButton = styled(Button)(({ theme }) => ({
    width: '150px',
    textTransform: 'none'
}));

const ModalBody = styled(Paper)(({ theme }) => ({
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '20px 30px'
}));

type AccountGeneralProps = {
    router: NextRouter;
    user: any;
    dispatchEditUserDetails: ({ firstName, email, lastName }) => void;
    dispatchSetAlerts: (alerts: Alert[]) => void;
}

type AccountGeneralState = {
    firstName: string;
    lastName: string;
    email: string;
    deleteModalOpen: boolean;
}

class AccountGeneral extends React.Component<AccountGeneralProps, AccountGeneralState> {
    constructor(props) {
        super(props);

        this.submitEditUserDetails = this.submitEditUserDetails.bind(this);
        this.submitUserDelete = this.submitUserDelete.bind(this);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            deleteModalOpen: false,
        }
    }

    async submitEditUserDetails() {
        const { user, dispatchEditUserDetails } = this.props;
        const {
            firstName,
            lastName,
            email
        } = this.state;

        dispatchEditUserDetails({
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            email: email || user.email
        });
    }

    async submitUserDelete() {
        const { user, router, dispatchSetAlerts } = this.props;

        axios.post(`/api/user/delete-verification`, null, { withCredentials: true })
        .then((res: any) => {
            dispatchSetAlerts([
                { type: 'success', message: 'We have sent you an email to verify you.' }
            ]);
        }).catch((err) => {
            dispatchSetAlerts(
                err.response.errors.map((error) => ({type: 'error', message: error}))
            )
        });
    }

    render() {
        const { user } = this.props;
        const { deleteModalOpen } = this.state;

        return (
            <Box marginTop="30px">
                <Stack spacing={5} direction="column">
                    <Paper sx={{ padding: '20px 30px' }} elevation={3}>
                        <Box display="grid" gridTemplateColumns="25% 75%">
                            <Typography
                                variant="h5"
                            >
                                Details
                            </Typography>
                            <Stack spacing={2} direction="column">
                                <Stack spacing={2} direction="row">
                                    <TextField
                                        fullWidth
                                        autoComplete="off"
                                        label="First name"
                                        defaultValue={user.firstName}
                                        onChange={(e) => this.setState({ firstName: e.target.value })}
                                    />
                                    <TextField
                                        fullWidth
                                        autoComplete="off"
                                        label="Last name"
                                        defaultValue={user.lastName}
                                        onChange={(e) => this.setState({ lastName: e.target.value })}
                                    />
                                </Stack>
                                <TextField
                                    fullWidth
                                    autoComplete="off"
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
                        <Stack spacing={1}>
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
                            <ErrorButton
                                color="error"
                                variant="outlined"
                                sx={{ marginTop: '30px !important' }}
                                onClick={() => this.setState({ deleteModalOpen: true })}
                            >
                                Delete Account
                            </ErrorButton>
                        </Stack>
                    </Paper>
                </Stack>
                <Modal
                    open={deleteModalOpen}
                    onClose={() => this.setState({ deleteModalOpen: false })}
                >
                    <ModalBody>
                        <Typography
                            gutterBottom
                            variant="h5"
                        >
                            Are you sure?
                        </Typography>
                        <Typography
                            variant="body1"
                        >
                            All data will be permanently removed.
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="30px">
                            <SmallButton
                                color="error"
                                variant="contained"
                                onClick={this.submitUserDelete}
                            >
                                Delete
                            </SmallButton>
                            <SmallButton
                                color="primary"
                                variant="outlined"
                                onClick={() => this.setState({ deleteModalOpen: false })}
                            >
                                Cancel
                            </SmallButton>
                        </Box>
                    </ModalBody>
                </Modal>
            </Box>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user.data
});

const mapDispatchToProps = (dispatch) => ({
    dispatchEditUserDetails: ({ firstName, email, lastName }) => dispatch(editUserDetails({ firstName, email, lastName })),
    dispatchSetAlerts: (alerts: Alert[]) => dispatch(setAlerts(alerts))
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(withRouter(AccountGeneral));