import React from "react";

import { compose } from "redux";
import { connect } from "react-redux";

import {
    setTicketPriority
} from '../../../../redux/ticket/actions';

import {
    styled,
    alpha
} from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import TicketHeader from "./TicketHeader";
import { 
    CriticalPriorityIcon, 
    HighPriorityIcon, 
    LowPriorityIcon, 
    MediumPriorityIcon 
} from "../Icons";

type TicketBodyProps = {
    project: any;
    ticket: any;

    dispatchSetTicketPriority: (projectId: string, ticketNumber: number, priority: string) => void;
}

type TicketBodyState = {
    priorityAnchorEl: null | HTMLElement;
    editingDescription: null | string;
}

const Body = styled('div')(({ theme }) => ({
    display: 'grid',
    columnGap: '20px',
    gridTemplateColumns: 'auto 350px',
    marginTop: '20px'
}));

const Main = styled('div')(({ theme }) => ({
    width: '100%'
}));

const Details = styled('div')(({ theme }) => ({
    width: '100%',
    height: 'fit-content',
    border: `1px solid ${theme.palette.grey['400']}`,
    borderRadius: theme.shape.borderRadius,
}));

const Detail = styled('div')(({ theme }) => ({
    height: '50px',
    padding: '0 20px',
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '50% 50%'
}));

const Priority = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '20px',
    cursor: 'pointer',
    padding: '5px 10px',
    width: 'fit-content',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
        backgroundColor: theme.palette.grey['300']
    }
}));

const SaveButtons = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '15px',
    marginTop: '10px'
}));

const SaveButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    width: '70px',
}));

const CreatedBy = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
    width: 'fit-content',
    padding: '5px 10px',
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: '25px', 
    height: '25px', 
    fontSize: '15px'
}))

class TicketBody extends React.Component<TicketBodyProps, TicketBodyState> {
    constructor(props) {
        super(props);

        this.getIconFromPriority = this.getIconFromPriority.bind(this);
        this.changeTicketPriority = this.changeTicketPriority.bind(this);
        this.state = {
            priorityAnchorEl: null,
            editingDescription: null
        }
    }

    getIconFromPriority() {
        const { ticket } = this.props;

        switch (ticket.priority) {
            case 'Low':
                return <LowPriorityIcon />
            case 'Medium':
                return <MediumPriorityIcon />
            case 'High':
                return <HighPriorityIcon />
            case 'Critical':
                return <CriticalPriorityIcon />
            default:
                return <MediumPriorityIcon />
        }
    }

    changeTicketPriority(priority: string) {
        const { project, ticket, dispatchSetTicketPriority } = this.props;
        dispatchSetTicketPriority(project.id, ticket.id, priority);
        this.setState({ priorityAnchorEl: null });
    }

    render() {
        const { project, ticket } = this.props;
        const { priorityAnchorEl, editingDescription } = this.state;

        return (
            <>
                <Body>
                    <TicketHeader />
                </Body>
                <Body>
                    <Main>
                        {editingDescription !== null ? (
                            <>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    label="Description"
                                    value={editingDescription}
                                    onChange={(e) => this.setState({ editingDescription: e.target.value })}
                                />
                                <SaveButtons>
                                    <SaveButton
                                        variant="contained"
                                    >
                                        Save
                                    </SaveButton>
                                    <SaveButton
                                        variant="outlined"
                                        onClick={(e) => this.setState({ editingDescription: null })}
                                    >
                                        Cancel
                                    </SaveButton>
                                </SaveButtons>
                            </>) : (
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                label="Description"
                                value={ticket.description}
                                onChange={(e) => this.setState({ editingDescription: e.target.value })}
                            />
                        )}
                    </Main>
                    <Details>
                        <Detail>
                            <Typography
                                variant="subtitle1"
                            >
                                Details
                            </Typography>
                        </Detail>
                        <Divider />
                        <Detail>
                            <Typography
                                variant="body2"
                            >
                                Priority:
                            </Typography>
                            <Priority onClick={(e) => this.setState({ priorityAnchorEl: e.currentTarget })}>
                                { this.getIconFromPriority() }
                                <Typography
                                    variant="body2"
                                >
                                    {ticket.priority}
                                </Typography>
                            </Priority>
                        </Detail>
                        <Detail>
                            <Typography
                                variant="body2"
                            >
                                Created by:
                            </Typography>
                            <CreatedBy>
                                <SmallAvatar>
                                    {ticket.user.firstName[0]}
                                </SmallAvatar>
                                <Typography
                                    noWrap
                                    variant="body2"
                                >
                                    {ticket.user.firstName} {ticket.user.lastName}
                                </Typography>
                            </CreatedBy>
                        </Detail>
                    </Details>
                </Body>
                <Menu
                    anchorEl={priorityAnchorEl}
                    open={Boolean(priorityAnchorEl)}
                    onClose={(e) => this.setState({ priorityAnchorEl: null })}
                >
                    <MenuItem onClick={() => this.changeTicketPriority('Low')}>
                        <ListItemIcon>
                            <LowPriorityIcon />
                        </ListItemIcon>
                        <ListItemText>
                            Low
                        </ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => this.changeTicketPriority('Medium')}>
                        <ListItemIcon>
                            <MediumPriorityIcon />
                        </ListItemIcon>
                        <ListItemText>
                            Medium
                        </ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => this.changeTicketPriority('High')}>
                        <ListItemIcon>
                            <HighPriorityIcon />
                        </ListItemIcon>
                        <ListItemText>
                            High
                        </ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => this.changeTicketPriority('Critical')}>
                        <ListItemIcon>
                            <CriticalPriorityIcon />
                        </ListItemIcon>
                        <ListItemText>
                            Critial
                        </ListItemText>
                    </MenuItem>
                </Menu>
            </>
        )
    }
}

const mapStateToProps = state => ({
    project: state.project.data,
    ticket: state.ticket.data
});

const mapDispatchToProps = dispatch => ({
    dispatchSetTicketPriority: (projectId: string, ticketNumber: number, priority: string) => dispatch(setTicketPriority(projectId, ticketNumber, priority))
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(TicketBody);