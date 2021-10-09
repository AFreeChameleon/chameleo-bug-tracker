import type { NextPage, GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    setUserDetails
} from '../redux/user/actions';

import {
    styled
} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import { prisma } from '../lib/prisma';
import withSession, { NextApiRequestWithSession } from '../lib/session';

import {
    setAlerts
} from '../redux/alerts/actions';

import Alerts from '../components/Alerts';
import ifNotAuth from '../components/auth/ifNotAuth';
import Header from '../components/Header';
import { isUserLoggedIn } from '../middleware/auth';
import ProjectTable from '../components/dashboard/ProjectTable';

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
                <ProjectTable newProjectRowOpen={creatingNewProject}  />
            </Container>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = withSession(
    async ({ req, res }) => {
        const id = req.session.get('user') || -1;
        const user = await prisma.user.findFirst({
            where: {
                id: id
            },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                notifications: true,
                projects: {
                    select: {
                        user: true
                    }
                }
            }
        });
        if (user) {
            console.log(user)
            if (!user) {
                return { props: {
                    user: {
                        firstName: ' ',
                        lastName: '',
                        email: '',
                        notifications: [],
                        projects: []
                    }
                } };
            }
        
            return {
                props: { 
                    ...user
                }
            };
        } else {
            return {
                props: { 
                    error: '>:('
                }
            };
        }
        

    }
);

export default Dashboard;