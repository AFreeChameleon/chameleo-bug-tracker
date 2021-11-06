import type { NextPage } from 'next';
import NextLink from 'next/link';
import axios from 'axios';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    setUserDetails,
    fetchUserData
} from '../../redux/user/actions';
import {
    setProjectData,
    fetchProjectDetails
} from '../../redux/project/actions';

import {
    styled
} from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Header from '../../components/Header';
import CreateModal from '../../components/projects/ticket/CreateModal';
import ifAuth from '../../components/auth/ifAuth';
import { authenticated } from '../../lib/auth';
import Alerts from '../../components/Alerts';
import DraggableBoards from '../../components/projects/ticket/DraggableBoards';

type ProjectPageProps = {
    project: any;
    user: any;
}

const HeadingDiv = styled('div')(({ theme }) => ({
    margin: '50px auto 0 auto',
}));

const LinkDiv = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    textDecoration: 'underline'
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
    
}));

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}));

const SmallButton = styled(Button)(({ theme }) => ({
    width: '80px',
    textTransform: 'none',
    fontSize: theme.typography.body1.fontSize
}))

const ProjectPage: NextPage<ProjectPageProps> = ({
    project,
    user,
}: ProjectPageProps) => {
    const dispatch = useDispatch();
    const [createModalOpen, setCreateModalOpen] = useState(true)
    useEffect(() => {
        dispatch(setUserDetails({
            ...user
        }));
        dispatch(setProjectData({
            ...project
        }));
    }, []);
    console.log(project);
    return (
        <div>
            <Header />
            <Container>
                <HeadingDiv>
                    <Breadcrumbs>
                        <NextLink
                            shallow
                            replace
                            href="/projects"
                        >
                            <LinkDiv>
                                Projects
                            </LinkDiv>
                        </NextLink>
                        <LinkDiv>
                            {project && project.name}
                        </LinkDiv>
                    </Breadcrumbs>
                    <FlexDiv sx={{marginTop: '30px'}}>
                        <HeaderTypography
                            variant="h1"
                        >
                            Tickets
                        </HeaderTypography>
                        <SmallButton
                            variant="contained"
                            onClick={(e) => setCreateModalOpen(true)}
                        >
                            Create
                        </SmallButton>
                    </FlexDiv>
                </HeadingDiv>
                {(project && project.tickets) && <DraggableBoards />}
            </Container>
            <CreateModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
            <Alerts />
        </div>
    )
}

ProjectPage.getInitialProps = async (ctx) => {
    try {
        let res: any;
        if (ctx.req) {
            res = await axios.get(`${process.env.HOST}/api/project/${ctx.query.project_id}/details`, { 
                withCredentials: true,
                headers: { Cookie: ctx.req.headers.cookie }
            });
        } else {
            res = await axios.get(`/api/project/${ctx.query.project_id}/details`, { 
                withCredentials: true,
            });
        }
        console.log(res.data)
        if (res.data.project && res.data.user) {
            return {
                project: res.data.project,
                user: res.data.user
            };
        } else {
            return { 
                user: null,
                project: null
            };
        }
    } catch (err) {
        // console.log(err);
        return {
            user: null,
            project: null
        }
    }
};

const AuthenticatedProjectPage = ifAuth(ProjectPage);

export default AuthenticatedProjectPage;