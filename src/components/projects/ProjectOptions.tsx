/*
!   THIS IS DEPRECATED BUT KEEPING IT UNLESS I NEED TO USE IT SOON
*/

import React from 'react';
import NextLink from 'next/link';
import { compose } from "redux";
import { connect } from "react-redux";

import { styled, alpha } from '@mui/system';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import MoreIcon from '@mui/icons-material/MoreHoriz';
import ArchiveIcon from '@mui/icons-material/Archive';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import AddUsersModal from './AddUsersModal';

const ModalBody = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: theme.palette.background.paper,
    padding: '20px'
}));

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}));

const SmallButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    width: '100px'
}));

type ProjectOptionsProps = {
    project: any;
    ticket: any;

    dispatchSetArchivedTickets: (id: string, ticketNumbers: number[], archived: boolean, refresh?: boolean) => void;
}

type ProjectOptionsState = {
    anchorEl: null | HTMLElement;
    addUsersModalOpen: boolean;
}

class ProjectOptions extends React.Component<ProjectOptionsProps, ProjectOptionsState> {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,

            addUsersModalOpen: false
        }
    }


    render() {
        const { project } = this.props;
        const { anchorEl, addUsersModalOpen } = this.state;

        return (
            <>
                <IconButton
                    onClick={(e) => this.setState({ anchorEl: e.currentTarget })}
                >
                    <MoreIcon />
                </IconButton>
                <Menu
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => this.setState({ anchorEl: null })}
                >
                    <NextLink href={`/projects/${project.id}/tickets/archived`}>
                        <Link sx={{ textDecoration: 'none' }}>
                            <MenuItem>
                                <ListItemIcon>
                                    <ArchiveIcon />
                                </ListItemIcon>
                                <ListItemText>
                                    View archived tickets
                                </ListItemText>
                            </MenuItem>
                        </Link>
                    </NextLink>
                    <MenuItem onClick={() => this.setState({ addUsersModalOpen: true })}>
                        <ListItemIcon>
                            <FolderSharedIcon />
                        </ListItemIcon>
                        <ListItemText>
                            Share
                        </ListItemText>
                    </MenuItem>
                </Menu>
                <AddUsersModal 
                    open={addUsersModalOpen}
                    onClose={() => this.setState({ addUsersModalOpen: false })}
                />
            </>
        )
    }
}

const mapStateToProps = state => ({
    project: state.project.data,
    ticket: state.ticket.data
});

const mapDispatchToProps = dispatch => ({
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(ProjectOptions);