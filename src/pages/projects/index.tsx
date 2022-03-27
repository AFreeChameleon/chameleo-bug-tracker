import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { NextPage, GetServerSideProps } from 'next';
import NextLink from 'next/link';
import _ from 'lodash';
import {
    setUserData
} from '../../redux/user/actions';

import {
    styled
} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { prisma } from '../../lib/prisma';
import withSession, { NextApiRequestWithSession } from '../../lib/session';

import Alerts from '../../components/Alerts';
import ifAuth from '../../components/auth/ifAuth';
import Header from '../../components/Header';
import { isUserLoggedIn } from '../../middleware/auth';
import ProjectTable from '../../components/projects/ProjectTable';
import ProjectBody from '../../components/projects/ProjectBody';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { setProjectData } from '../../redux/project/actions';

type DashboardProps = {
    user: {
        firstName: string;
        lastName: string;
        email: string;
        notifications: any[];
        projects: any[];
    }
}

const HeadingDiv = styled('div')(({ theme }) => ({
    margin: '50px 0 0 0',
    width: 'calc(100vw - 350px)'
}));

const LinkDiv = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    textDecoration: 'underline'
}));

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
    
}));

const Container = styled('div')(({ theme }) => ({
    width: '100%'
}));

const Dashboard: NextPage<DashboardProps> = ({user}: DashboardProps) => {
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
                <Container sx={{ paddingLeft: '50px' }}>
                <HeadingDiv>
                        <Breadcrumbs>
                            <NextLink
                                shallow
                                href="/projects"
                            >
                                <LinkDiv>
                                    Projects
                                </LinkDiv>
                            </NextLink>
                        </Breadcrumbs>
                        <FlexDiv sx={{marginTop: '30px'}}>
                            <HeaderTypography
                                variant="h1"
                            >
                                Projects
                            </HeaderTypography>
                        </FlexDiv>
                        {/* <Button
                            variant="contained"
                            onClick={(e) => setCreatingNewProject(!creatingNewProject)}
                        >
                            {creatingNewProject ? 'Cancel' : 'Create'}
                        </Button> */}
                    </HeadingDiv>
                    <ProjectBody />
                </Container>
            </Box>
            <Alerts/>
        </div>
    )
}

Dashboard.getInitialProps = async (ctx) => {
    try {
        let res: any;
        if (ctx.req) {
            res = await axios.get(`${process.env.HOST}/api/user/details`, { 
                withCredentials: true,
                headers: { Cookie: ctx.req.headers.cookie }
            });
        } else {
            res = await axios.get(`/api/user/details`, { 
                withCredentials: true,
            });
        }
        if (res.data.user) {
            return {
                user: {
                    ...res.data.user
                }
            };
        } else {
            return { 
                user: {
                }
            };
        }
    } catch (err) {
        console.log(err);
        return {
            user: {
            }
        }
    }
};

const AuthenticatedDashboard = ifAuth(Dashboard);

export default AuthenticatedDashboard;