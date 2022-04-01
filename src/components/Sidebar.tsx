import React from 'react';
import { withRouter } from 'next/router';
import NextLink from 'next/link';
import _ from 'lodash';

import { compose } from 'redux';
import { connect } from 'react-redux';

import {
    styled
} from '@mui/material/styles';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import LogoutIcon from '@mui/icons-material/Logout';
import ArchiveIcon from '@mui/icons-material/Archive';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import AddUsersModal from './projects/AddUsersModal';

const Root = styled('div')(({ theme }: any) => ({
    width: '250px',
    borderRight: `1px solid ${theme.palette.grey['200']}`,
    height: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.light,
    position: 'sticky',
    top: '64px'
}));

const Subtitle: typeof Typography = styled(Typography)(({ theme }) => ({
    marginTop: '30px !important',
    fontWeight: 600,
    paddingLeft: '25px',
}));

const SelectedListItem = styled(ListItemIcon)(({ theme }) => ({
    width: '2px',
    minWidth: '2px !important',
    height: '50px',
    backgroundColor: theme.palette.primary.main,
    // marginRight: '25px'
}));

const TicketLabel: typeof Typography = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.subtitle2.fontSize,
    color: theme.palette.text.secondary
}));

const FlexGrow = styled('div')(({ theme }) => ({
    flexGrow: 1
}));

type SidebarProps = {
    user: any;
    project: any;
    ticket: any;

    ticketView: boolean;
}

type SidebarState = {
    addUsersModalOpen: boolean;
}

class Sidebar extends React.Component<SidebarProps, SidebarState> {
    constructor(props) {
        super(props);

        this.state = {
            addUsersModalOpen: false
        }
    }

    render() {
        const { user, project, ticket, ticketView } = this.props;
        const { addUsersModalOpen } = this.state;
        console.log(user, project, ticket, _.isEmpty(project))
        return (
            <Root>
                <Subtitle
                    variant="caption"
                    component="div"
                >
                    PROJECTS
                </Subtitle>
                <MenuList>
                    { user.projects.map((projectItem, i) => (
                        <NextLink 
                            key={i}
                            href={`/projects/${projectItem.id}/`}
                        >
                            <MenuItem sx={{
                                padding: 0,
                                height: '50px'
                            }}>
                                { project.id === projectItem.id && <SelectedListItem/> }
                                <ListItemText sx={{
                                    paddingLeft: project.id === projectItem.id ? '23px' : '25px',
                                    fontSize: '16px'
                                }}>
                                    {projectItem.name}
                                </ListItemText>
                            </MenuItem>
                        </NextLink>
                    )) }
                </MenuList>
                { user.history.length > 0 && (<>
                    <Subtitle
                        variant="caption"
                        component="div"
                    >
                        RECENT TICKETS
                    </Subtitle>
                    <MenuList>
                        {ticketView && <MenuItem sx={{
                            padding: 0,
                            height: '50px'
                        }}>
                            <SelectedListItem/>
                            <Box sx={{
                                paddingLeft: '25px',
                                fontSize: '16px',
                                width: '100%'
                            }}>
                                <Typography
                                    variant="caption"
                                    sx={{ color: '#888' }}
                                >
                                    {project.name}
                                </Typography>
                                <Typography noWrap>
                                    {ticket.name}
                                </Typography>
                            </Box>
                        </MenuItem>}
                        {user.history.filter(h => !ticketView || h.ticketId !== ticket.id).map((h) => (
                            <NextLink 
                                key={h.id}
                                href={`/projects/${h.project.id}/tickets/${h.ticket.ticketNumber}`}
                            >
                                <Link sx={{ textDecoration: 'none' }}>
                                    <MenuItem sx={{
                                        padding: 0,
                                        height: '50px'
                                    }}>
                                        <Box
                                            paddingLeft="25px"
                                            fontSize="16px"
                                            width="100%"
                                        >
                                            <TicketLabel
                                                variant="caption"
                                            >
                                                {h.project.name}
                                            </TicketLabel>
                                            <Typography noWrap>
                                                {h.ticket.name}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                </Link>
                            </NextLink>
                        ))}
                    </MenuList>
                </>)}
                { !_.isEmpty(project) && (<>
                <Subtitle
                    variant="caption"
                    component="div"
                >
                    MORE
                </Subtitle>
                <MenuList>
                    <NextLink
                        href={`/projects/${project.id}/tickets/archived`}
                    >
                        <MenuItem sx={{
                            paddingLeft: '23px',
                            height: '50px'
                        }}>
                            <ListItemIcon>
                                <ArchiveIcon color="primary"/>
                            </ListItemIcon>
                            <ListItemText sx={{
                                fontSize: '16px'
                            }}>
                                Archived Tickets
                            </ListItemText>
                        </MenuItem>
                    </NextLink>
                    <MenuItem onClick={() => this.setState({ addUsersModalOpen: true })} sx={{
                        paddingLeft: '23px',
                        height: '50px'
                    }}>
                        <ListItemIcon>
                            <FolderSharedIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText>
                            Share
                        </ListItemText>
                    </MenuItem>
                </MenuList></>) }
                <FlexGrow/>
                <NextLink href="/account">
                    <MenuItem sx={{
                        height: '50px',
                        borderTop: (theme) => `1px solid ${theme.palette.grey['200']}`
                    }}>
                        <ListItemIcon>
                            <AccountCircleIcon color="primary"/>
                        </ListItemIcon>
                        <ListItemText>
                            Account
                        </ListItemText>
                    </MenuItem>
                </NextLink>
                {!_.isEmpty(project) && <AddUsersModal 
                    open={addUsersModalOpen}
                    onClose={() => this.setState({ addUsersModalOpen: false })}
                />}
            </Root>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user.data,
    project: state.project.data,
    ticket: state.ticket.data
});

export default compose<any>(
    connect(mapStateToProps)
)(withRouter(Sidebar));