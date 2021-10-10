import type { NextPage } from 'next';
import NextLink from 'next/link';
import axios from 'axios';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    setUserDetails
} from '../../redux/user/actions';

import {
    styled
} from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Header from '../../components/Header';
import CreateModal from '../../components/dashboard/ticket/CreateModal';

type ProjectPageProps = {
    project: any;
    user: any
}

const HeadingDiv = styled('div')(({ theme }) => ({
    margin: '50px auto 0 auto',
}));

const LinkDiv = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    textDecoration: 'underline'
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
    marginTop: '30px'
}))

const ProjectPage: NextPage<ProjectPageProps> = ({
    project,
    user
}: ProjectPageProps) => {
    const dispatch = useDispatch();
    const [createModalOpen, setCreateModalOpen] = useState(true)
    useEffect(() => {
        dispatch(setUserDetails({
            ...user
        }))
    }, []);
    console.log(project, user)
    return (
        <div>
            <Header />
            <Container>
                <HeadingDiv>
                    <Breadcrumbs>
                        <NextLink href="/dashboard">
                            <LinkDiv>
                                Projects
                            </LinkDiv>
                        </NextLink>
                        <LinkDiv>
                            {project.name}
                        </LinkDiv>
                    </Breadcrumbs>
                    <HeaderTypography
                        variant="h1"
                    >
                        Tickets
                    </HeaderTypography>
                </HeadingDiv>
                <CreateModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
            </Container>
        </div>
    )
}

ProjectPage.getInitialProps = async (ctx) => {
    try {
        let res: any;
        if (ctx.req) {
            res = await axios.get(`${process.env.HOST}/api/project/details?key=${ctx.query.key}`, { 
                withCredentials: true,
                headers: { Cookie: ctx.req.headers.cookie }
            });
        } else {
            res = await axios.get(`${process.env.HOST}/api/project/details?key=${ctx.query.key}`, { 
                withCredentials: true,
            });
        }
        console.log(res.data)
        if (res.data.project && res.data.user) {
            console.log(res.data.project)
        
            return {
                project: res.data.project,
                user: res.data.user
            };
        } else {
            return { 
                user: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    notifications: [],
                    projects: []
                },
                project: {}
            };
        }
    } catch (err) {
        console.log(err.message);
        return {
            user: {
                firstName: '',
                lastName: '',
                email: '',
                notifications: [],
                projects: []
            },
            project: {}
        }
    }
};

export default ProjectPage;