import type { NextPage } from 'next';
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
import DraggableBoards from '../../../../components/projects/tickets/DraggableBoards';
import Sidebar from '../../../../components/Sidebar';

type TicketPageProps = {
    project: any;
    user: any;
    ticket: any;
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

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
}));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey['400']}`,
    marginRight: '30px',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const TicketPage: NextPage<TicketPageProps> = ({
    project,
    user,
    ticket
}) => {
    return (
        <div>
            <Header createTicket />
            <Box display="grid" gridTemplateColumns="250px auto">
                <Sidebar />
                <Container>
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
                        </FlexDiv>
                        <FlexDiv sx={{marginTop: '30px'}}>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                        </FlexDiv>
                    </HeadingDiv>
                    {(project && project.tickets) && <DraggableBoards />}
                </Container>
            </Box>
            <Alerts />
        </div>
    )
}

export default TicketPage;