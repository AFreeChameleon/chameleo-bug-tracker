import { useEffect } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import type { NextPage } from 'next';
import axios from 'axios';
import NextLink from 'next/link';

import {
    styled,
    alpha
} from '@mui/material/styles';
import Container from '@mui/material/Container';
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

type TicketPageProps = {
    project: any;
    user: any;
    ticket: any;
}

const TicketPage: NextPage<TicketPageProps> = ({
    project,
    user,
    ticket
}) => {
    const projectData = useSelector((state: any) => state.project.data);
    const userData = useSelector((state: any) => state.user.data);
    const ticketData = useSelector((state: any) => state.ticket.data);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setProjectData(project));
        dispatch(setUserData(user));
        dispatch(setTicketData(ticket));
    }, []);

    if (_.isEmpty(projectData) || _.isEmpty(userData) || _.isEmpty(ticketData)) {
        return null;
    }

    return (
        <div>
            <Header createTicket />
            <Box display="grid" gridTemplateColumns="250px auto">
                <Sidebar />
                <Container>
                    <TicketHeader />
                    <TicketBody />
                </Container>
            </Box>
            <Alerts />
        </div>
    )
}

TicketPage.getInitialProps = async (ctx) => {
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
            ticketRes = axios.get(`${process.env.HOST}/api/project/${ctx.query.project_id}/ticket/${ctx.query.ticket_number}/details`, {
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
            ticketRes = axios.get(`/api/project/${ctx.query.project_id}/ticket/${ctx.query.ticket_number}/details`, {
                withCredentials: true,
            });
        }
        const [project, user, ticket] = await Promise.all([projectRes, userRes, ticketRes])
        if (project && user) {
            return {
                project: project.data.project,
                user: user.data.user,
                ticket: ticket.data.ticket
            };
        } else {
            return { 
                user: null,
                project: null,
                ticket: null
            };
        }
    } catch (err) {
        return {
            user: null,
            project: null,
            ticket: null
        }
    }
}

const AuthenticatedTicketPage = ifAuth(TicketPage);

export default AuthenticatedTicketPage;