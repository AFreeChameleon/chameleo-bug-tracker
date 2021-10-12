import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import axios from 'axios';

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

import {
    setAlerts
} from '../redux/alerts/actions';

import Alerts from '../components/Alerts';
import ifNotAuth from '../components/auth/ifNotAuth';

type LoginProps = {
    dispatchSetAlerts: (value: any[]) => void;
}


const Login: NextPage<LoginProps> = ({ dispatchSetAlerts }: LoginProps) => {
    const router = useRouter();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        axios.post('/api/login', {
            email: data.get('email'),
            password: data.get('password')
        }, { withCredentials: true })
        .then((res) => {
            router.push('/dashboard')
        })
        .catch((err) => {
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

  return (
    <Container component="main" maxWidth="xs" sx={{
        height: '100vh',
        display: 'grid',
        placeItems: 'center'
    }}>
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign In
                </Button>
                <Grid container>
                    {/* <Grid item xs>
                        <Link href="#" variant="body2">
                            Forgot password?
                        </Link>
                    </Grid> */}
                    <Grid item>
                        <NextLink href="/register">
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
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

const mapStateToProps = (state: any) => ({
});

const mapDispatchToProps = (dispatch: any) => ({
    dispatchSetAlerts: (values: any[]) => dispatch(setAlerts(values))
});

const NotAuthenticatedLogin = ifNotAuth(Login);

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(NotAuthenticatedLogin);