import React from 'react';
import { compose } from "redux";
import { connect } from "react-redux";

import {
    setArchivedTickets
} from '../../../../redux/project/actions';

import { styled, alpha } from '@mui/system';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import MoreIcon from '@mui/icons-material/MoreHoriz';
import ArchiveIcon from '@mui/icons-material/Archive';

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

type TicketOptionsProps = {
    project: any;
    ticket: any;

    dispatchSetArchivedTickets: (id: string, ticketNumbers: number[], archived: boolean, refresh?: boolean) => void;
}

type TicketOptionsState = {
    anchorEl: null | HTMLElement;
    archiveModalOpen: boolean;
}

class TicketOptions extends React.Component<TicketOptionsProps, TicketOptionsState> {
    constructor(props) {
        super(props);
        
        this.archiveTicket = this.archiveTicket.bind(this);

        this.state = {
            anchorEl: null,

            archiveModalOpen: false
        }
    }

    archiveTicket() {
        const { project, ticket, dispatchSetArchivedTickets } = this.props;

        dispatchSetArchivedTickets(project.id, [ticket.ticketNumber], true, true);
        this.setState({ anchorEl: null });
    }


    render() {
        const { anchorEl, archiveModalOpen } = this.state;
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
                    <MenuItem onClick={() => this.setState({ archiveModalOpen: true })}>
                        <ListItemIcon>
                            <ArchiveIcon />
                        </ListItemIcon>
                        <ListItemText>
                            Archive
                        </ListItemText>
                    </MenuItem>
                </Menu>
                <Modal
                    open={archiveModalOpen}
                    onClose={() => this.setState({ archiveModalOpen: false })}
                >
                    <ModalBody>
                        <Typography
                            sx={{ marginBottom: '20px' }}
                            variant="h5"
                        >
                            Archive
                        </Typography>
                        <Typography
                            sx={{ marginBottom: '25px' }}
                        >
                            Are you sure you want to archive this ticket?
                        </Typography>
                        <FlexDiv>
                            <SmallButton
                                variant="contained"
                                onClick={this.archiveTicket}
                            >
                                Archive
                            </SmallButton>
                            <SmallButton
                                variant="outlined"
                                onClick={() => this.setState({ archiveModalOpen: false })}
                            >
                                Cancel
                            </SmallButton>
                        </FlexDiv>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    project: state.project.data,
    ticket: state.ticket.data
});

const mapDispatchToProps = dispatch => ({
    dispatchSetArchivedTickets: (id: string, ticketNumbers: number[], archived: boolean, refresh?: boolean) => dispatch(setArchivedTickets(id, ticketNumbers, archived, refresh))
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(TicketOptions);