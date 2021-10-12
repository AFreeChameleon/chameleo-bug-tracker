import type { NextPage, GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    setUserDetails
} from '../../redux/user/actions';

import {
    styled
} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import { prisma } from '../../lib/prisma';
import withSession, { NextApiRequestWithSession } from '../../lib/session';

import Alerts from '../../components/Alerts';
import ifAuth from '../../components/auth/ifAuth';
import Header from '../../components/Header';
import { isUserLoggedIn } from '../../middleware/auth';
import ProjectTable from '../../components/dashboard/ProjectTable';
import axios from 'axios';

type DashboardProps = {
    firstName: string;
    lastName: string;
    email: string;
    notifications: any[];
    projects: any[];
}

const HeadingDiv = styled('div')(({ theme }) => ({
    margin: '20px auto 0 auto',
    display: 'flex',
    justifyContent: 'space-between',

}));

const Dashboard: NextPage<DashboardProps> = ({ firstName, lastName, email, notifications, projects }: DashboardProps) => {
    console.log(firstName, projects);
    const [creatingNewProject, setCreatingNewProject] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setUserDetails({
            firstName,
            lastName,
            email,
            notifications,
            projects
        }))
    }, []);
    return (
        <div>
            <Header />
            <Container>
                <HeadingDiv>
                    <Typography
                        variant="h1"
                    >
                        Projects
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={(e) => setCreatingNewProject(!creatingNewProject)}
                    >
                        {creatingNewProject ? 'Cancel' : 'Create'}
                    </Button>
                </HeadingDiv>
                <ProjectTable newProjectRowOpen={creatingNewProject} setNewProjectRowOpen={(val: boolean) => setCreatingNewProject(val)} />
            </Container>
            <Alerts/>
        </div>
    )
}

Dashboard.getInitialProps = async (ctx) => {
    try {
        let res: any;
        if (ctx.req) {
            console.log(ctx.req.headers)
            res = await axios.get(`${process.env.HOST}/api/user/details`, { 
                withCredentials: true,
                headers: { Cookie: ctx.req.headers.cookie }
            });
            console.log(res.data)
        } else {
            res = await axios.get(`${process.env.HOST}/api/user/details`, { 
                withCredentials: true,
            });
        }
        if (res.data.user) {
            return {
                ...res.data.user
            };
        } else {
            return { 
                user: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    notifications: [],
                    projects: []
                }
            };
        }
    } catch (err) {
        console.log(err);
        return {
            user: {
                firstName: '',
                lastName: '',
                email: '',
                notifications: [],
                projects: []
            }
        }
    }
};

const AuthenticatedDashboard = ifAuth(Dashboard);

export default AuthenticatedDashboard;