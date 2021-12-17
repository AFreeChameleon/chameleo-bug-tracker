import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    setUserData,
    fetchUserData
} from '../../redux/user/actions';

import axios from 'axios';
import _ from 'lodash';

import {
    styled,
    alpha
} from '@mui/material/styles';

import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';

import ifAuth from '../../components/auth/ifAuth';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import AccountTabs from '../../components/account/AccountTabs';
import AccountGeneral from '../../components/account/AccountGeneral';
import Alerts from '../../components/Alerts';
import AccountSecurity from '../../components/account/AccountSecurity';

const Container = styled('div')(({ theme }) => ({
    width: '100%'
}));

const HeadingDiv = styled('div')(({ theme }) => ({
    margin: '50px 0 0 0',
    width: 'calc(100vw - 350px)'
}));

const LinkDiv = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    textDecoration: 'underline'
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
    
}));

type AccountSecurityPageProps = {
    user: any;
}

const AccountSecurityPage: NextPage<AccountSecurityPageProps> = ({ user }) => {
    const router = useRouter();
    const userData = useSelector((state: any) => state.user.data);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setUserData(user));
    }, []);

    if (_.isEmpty(userData)) {
        return null;
    }

    return (
        <div>
            <Header />
            <Box display="grid" gridTemplateColumns="250px auto">
                <Sidebar />
                <Container sx={{ paddingLeft: '50px', width: '815px' }}>
                    <HeadingDiv>
                        <Breadcrumbs>
                            <NextLink
                                shallow
                                href="/projects"
                            >
                                <LinkDiv>
                                    Home
                                </LinkDiv>
                            </NextLink>
                            <LinkDiv>
                                Account
                            </LinkDiv>
                        </Breadcrumbs>
                        <Box marginTop="30px">
                            <HeaderTypography
                                variant="h1"
                            >
                                Account
                            </HeaderTypography>
                        </Box>
                    </HeadingDiv>
                    <AccountTabs selectedTab={2} />
                    <AccountSecurity />
                </Container>
            </Box>
            <Alerts />
        </div>
    )
}

AccountSecurityPage.getInitialProps = async (ctx) => {
    try {
        let userRes: any;
        if (ctx.req) {
            userRes = axios.get(`${process.env.HOST}/api/user/details`, {
                withCredentials: true,
                headers: { Cookie: ctx.req.headers.cookie }
            });
        } else {
            userRes = axios.get('/api/user/details', {
                withCredentials: true,
            });
        }
        const [user] = await Promise.all([userRes])
        if (user) {
            return {
                user: user.data.user
            };
        } else {
            return { 
                user: null,
            };
        }
    } catch (err) {
        // console.log(err);
        return {
            user: null,
        }
    }
}

const AuthenticatedAccountSecurityPage = ifAuth(AccountSecurityPage);

export default AuthenticatedAccountSecurityPage;