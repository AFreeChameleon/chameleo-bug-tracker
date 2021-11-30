import { NextPage } from "next";
import { useRouter } from 'next/router';

import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';

import _ from 'lodash';
import axios from 'axios';

import {
    styled,
    alpha
} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';

import SearchIcon from '@mui/icons-material/Search';

import Header from '../../../../components/Header';
import ifAuth from '../../../../components/auth/ifAuth';
import { authenticated } from '../../../../lib/auth';
import Alerts from '../../../../components/Alerts';
import Sidebar from '../../../../components/Sidebar';
import TicketHeader from '../../../../components/projects/tickets/single/TicketHeader';
import TicketBody from '../../../../components/projects/tickets/single/TicketBody';
import { setProjectData } from '../../../../redux/project/actions';
import { setUserData } from '../../../../redux/user/actions';
import { setTicketData } from '../../../../redux/ticket/actions';
import ArchivedTicket from '../../../../components/projects/tickets/single/ArchivedTicket';
import ArchivedTicketsHeader from "../../../../components/projects/tickets/archived/ArchivedTicketsHeader";
import ArchivedTicketsBody from "../../../../components/projects/tickets/archived/ArchivedTicketsBody";

const Container = styled('div')(({ theme }) => ({
    padding: '0 50px',
    maxWidth: '1280px'
}));

type ArchivedTicketsPageProps = {
    project: any;
    user: any;
};

type ArchivedTicketsPageState = {

};

const ArchivedTicketsPage: NextPage<ArchivedTicketsPageProps> = ({
    project,
    user
}) => {
    const router = useRouter();
    const projectData = useSelector((state: any) => state.project.data);
    const userData = useSelector((state: any) => state.user.data);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setProjectData(project));
        dispatch(setUserData(user));
    }, []);
    console.log(project, user)

    if (_.isEmpty(projectData) || _.isEmpty(userData)) {
        return null;
    }

    return (
        <div>
            <Header createTicket />
            <Box display="grid" gridTemplateColumns="250px auto">
                <Sidebar />
                <Container>
                    <ArchivedTicketsHeader />
                    <ArchivedTicketsBody />
                </Container>
            </Box>
            <Alerts />
        </div>
    )
}

ArchivedTicketsPage.getInitialProps = async (ctx) => {
    try {
        let projectRes: any;
        let userRes: any;
        let ticketRes: any;
        if (ctx.req) {
            projectRes = axios.get(`${process.env.HOST}/api/project/${ctx.query.project_id}/details`, { 
                withCredentials: true,
                headers: { Cookie: ctx.req.headers.cookie }
            });
            userRes = axios.get(`${process.env.HOST}/api/user/details`, {
                withCredentials: true,
                headers: { Cookie: ctx.req.headers.cookie }
            });
        } else {
            projectRes = axios.get(`/api/project/${ctx.query.project_id}/details`, { 
                withCredentials: true,
            });
            userRes = axios.get('/api/user/details', {
                withCredentials: true,
            });
        }
        const [project, user] = await Promise.all([projectRes, userRes])
        if (project && user) {
            return {
                project: project.data.project,
                user: user.data.user,
            };
        } else {
            return { 
                user: null,
                project: null,
            };
        }
    } catch (err) {
        console.log(err)
        return {
            user: null,
            project: null,
        }
    }
}

const AuthenticatedArchivedTicketsPage = ifAuth(ArchivedTicketsPage);

export default AuthenticatedArchivedTicketsPage;