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
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const Card = styled(Paper)(({ theme }) => ({
    height: '290px',
    width: '225px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px 30px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: '0.2s',
    '&:hover': {
        borderColor: theme.palette.primary.main
    }
}));

const SmallButton = styled(Button)(({ theme }) => ({
    width: '100px',
    textTransform: 'none'
}));

class AccountBilling extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box margin="30px 0">
                <Stack spacing={5} direction="column">
                    <Paper sx={{ padding: '20px 30px' }} elevation={3}>
                        <Stack spacing={1} direction="column">
                            <Typography
                                variant="h5"
                            >
                                Plans
                            </Typography>
                            <Typography
                                variant="body1"
                            >
                                You can change your plan any time
                            </Typography>
                        </Stack>
                        <Stack spacing={2} marginTop="20px" direction="row">
                            {/* Starter */}
                            <Card variant="outlined">
                                <Typography
                                    variant="h3"
                                >
                                    Starter
                                </Typography>
                                <Box display="flex" alignItems="flex-end" columnGap="5px" marginTop="15px">
                                    <Typography
                                        variant="h1"
                                    >
                                        $0
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{ paddingBottom: '4px' }}
                                    >
                                        /mo
                                    </Typography>
                                </Box>
                                <Divider sx={{ backgroundColor: 'black', width: '35px', marginTop: '20px' }}/>
                                <Stack spacing={1} marginTop="20px" alignItems="center">
                                    <Typography>
                                        <strong>10</strong> Projects
                                    </Typography>
                                    <Typography>
                                        <strong>5,000</strong> Tickets
                                    </Typography>
                                    <Typography>
                                        <strong>250MB</strong> File storage
                                    </Typography>
                                </Stack>
                            </Card>
                            {/* Hobby */}
                            <Card variant="outlined">
                                <Typography
                                    variant="h3"
                                >
                                    Hobby
                                </Typography>
                                <Box display="flex" alignItems="flex-end" columnGap="5px" marginTop="15px">
                                    <Typography
                                        variant="h1"
                                    >
                                        $5
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{ paddingBottom: '4px' }}
                                    >
                                        /mo
                                    </Typography>
                                </Box>
                                <Divider sx={{ backgroundColor: 'black', width: '35px', marginTop: '20px' }}/>
                                <Stack spacing={1} marginTop="20px" alignItems="center">
                                    <Typography>
                                        <strong>Unlimited</strong> Projects
                                    </Typography>
                                    <Typography>
                                        <strong>Unlimited</strong> Tickets
                                    </Typography>
                                    <Typography>
                                        <strong>2GB</strong> File storage
                                    </Typography>
                                    <Typography>
                                        <strong>5,000</strong> API calls
                                    </Typography>
                                </Stack>
                            </Card>
                            {/* Enterprise */}
                            <Card variant="outlined">
                                <Typography
                                    variant="h3"
                                >
                                    Enterprise
                                </Typography>
                                <Box display="flex" alignItems="flex-end" columnGap="5px" marginTop="15px">
                                    <Typography
                                        variant="h1"
                                    >
                                        $15
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{ paddingBottom: '4px' }}
                                    >
                                        /mo
                                    </Typography>
                                </Box>
                                <Divider sx={{ backgroundColor: 'black', width: '35px', marginTop: '20px' }}/>
                                <Stack spacing={1} marginTop="20px" alignItems="center">
                                    <Typography>
                                        <strong>Unlimited</strong> Projects
                                    </Typography>
                                    <Typography>
                                        <strong>Unlimited</strong> Tickets
                                    </Typography>
                                    <Typography>
                                        <strong>50GB</strong> File storage
                                    </Typography>
                                    <Typography>
                                        <strong>Unlimited</strong> API calls
                                    </Typography>
                                </Stack>
                            </Card>
                        </Stack>
                        <Typography
                            variant="body2"
                            sx={{ marginTop: '15px' }}
                        >
                            Need a custom plan?&nbsp;
                            <Link sx={{ cursor: 'pointer' }} href="mailto:support@chameleo.dev">
                                Talk to us
                            </Link>
                        </Typography>
                        <Divider sx={{ marginTop: '15px' }}/>
                        <Box display="grid" gridTemplateColumns="40% 60%" marginTop="20px">
                            <Typography
                                variant="h5"
                            >
                                Update payment information
                            </Typography>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Card number"
                                />
                                <Stack spacing={2} direction="row">
                                    <TextField
                                        fullWidth
                                        label="MM/YY"
                                    />
                                    <TextField
                                        fullWidth
                                        label="CVC"
                                    />
                                </Stack>
                                <SmallButton
                                    variant="contained"
                                    sx={{ marginTop: '30px !important'}}
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

export default AccountBilling;