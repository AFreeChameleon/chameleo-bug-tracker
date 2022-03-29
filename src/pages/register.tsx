import React, { useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { compose } from 'redux';
import { connect } from 'react-redux';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

import {
    setAlerts
} from '../redux/alerts/actions';

import Alerts from '../components/Alerts';

type RegisterProps = {
    dispatchSetAlerts: (value: any[]) => void;
}

function Register({ dispatchSetAlerts }: RegisterProps) {
    const router = useRouter();
    const [success, setSuccess] = useState('');
    const [emailVal, setEmailVal] = useState('');
    const [acceptTOC, setAcceptTOC] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (!acceptTOC) {
            dispatchSetAlerts([ {
                type: 'error',
                message: 'Please accept our terms and conditions before registering.'
            } ]);
            return;
        }
        if (!(data.get('email') && data.get('password') && data.get('firstName') && data.get('lastName'))) {
            dispatchSetAlerts([ {
                type: 'error',
                message: 'Missing values. Please check everything is filled in.'
            } ]);
            return;
        }
        axios.post('/api/register', {
            email: data.get('email'),
            password: data.get('password'),
            first_name: data.get('firstName'),
            last_name: data.get('lastName')
        })
        .then((res: any) => {
            dispatchSetAlerts([]);
            setSuccess(res.data.message);
            setEmailVal((data.get('email') as string).toString());
        })
        .catch((err: any) => {
            if (err.response) {
                dispatchSetAlerts(
                    err.response.data.errors.map((e: string) => ({
                        type: 'error',
                        message: e
                    }))
                );
            } else {
                dispatchSetAlerts([ {
                    type: 'error',
                    message: err.message
                } ]);
            }
        })
    };

    const resendEmail = () => {
        setSuccess('');
        axios.post(`/api/verify-email/resend`, {
            email: emailVal
        })
        .then((res: any) => {
            dispatchSetAlerts([]);
            setSuccess(res.data.message);
        })
        .catch((err: any) => {
            if (err.response) {
                dispatchSetAlerts(
                    err.response.data.errors.map((e: string) => ({
                        type: 'error',
                        message: e
                    }))
                );
            } else {
                dispatchSetAlerts([ {
                    type: 'error',
                    message: err.message
                } ]);
            }
        })
    }

    return (
        <Container component="main" maxWidth="xs" sx={{
            height: '100vh',
            display: 'grid',
            placeItems: 'center'
        }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                { success && <Stack sx={{ width: '100%', marginTop: '10px' }} spacing={2}>
                    <Alert severity="success">
                        {success}
                        <br/>
                        Didn&apos;t recieve an email? <Link 
                            sx={{
                                cursor: 'pointer'
                            }} 
                            onClick={resendEmail} 
                            variant="body2"
                        >
                            Click here!
                        </Link>
                    </Alert>
                </Stack> }
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                name="acceptTOC"
                                componentsProps={{
                                    typography: {
                                        sx: {
                                            fontSize: 'body2.fontSize'
                                        }
                                    }
                                }}
                                control={<Checkbox checked={acceptTOC} onChange={(e) => setAcceptTOC(e.target.checked)} color="primary" />}
                                label="By clicking this you accept our terms and conditions."
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <NextLink href="/login">
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Alerts />
        </Container>
    );
}

Register.displayName = 'Register';

const mapStateToProps = (state: any) => ({
});

const mapDispatchToProps = (dispatch: any) => ({
    dispatchSetAlerts: (values: any[]) => dispatch(setAlerts(values))
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(Register);