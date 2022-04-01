import React from 'react';

import { compose } from "redux";
import { connect } from "react-redux";

import {
    setTicketPriority,
    setTicketAssignedTo,
    setTicketTimeEstimate
} from '../../../../redux/ticket/actions';

import {
    setAlerts
} from '../../../../redux/alerts/actions';

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
import IconButton from '@mui/material/IconButton';

import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { 
    CriticalPriorityIcon, 
    HighPriorityIcon, 
    LowPriorityIcon, 
    MediumPriorityIcon 
} from "../Icons";
import { validateTime } from '../../../../lib/ticket';

type TicketDetailsProps = {
    project: any;
    ticket: any;
    user: any

    dispatchSetAlerts: (alerts) => void;
    dispatchSetTicketPriority: (projectId: string, ticketNumber: number, priority: string) => void;
    dispatchSetTicketAssignedTo: (projectId: string, ticketNumber: number, user: any) => void;
    dispatchSetTicketTimeEstimate: (projectId: string, ticketNumber: number, time: string) => void;
}

type TicketDetailsState = {
    priorityAnchorEl: null | HTMLElement;
    assignedToAnchorEl: null | HTMLElement;

    editingTimeEstimate: null | string;
}

const Details = styled('div')(({ theme }) => ({
    width: '100%',
    height: 'fit-content',
    border: `1px solid ${theme.palette.grey['400']}`,
    borderRadius: theme.shape.borderRadius,
    paddingBottom: '10px'
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

const AssignedTo = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '10px',
    cursor: 'pointer',
    alignItems: 'center',
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
}));

const TimeEstimate = styled('div')(({ theme }) => ({
    maxWidth: '120px',
    marginLeft: '10px'
}))

class TicketDetails extends React.Component<TicketDetailsProps, TicketDetailsState> {
    constructor(props) {
        super(props);

        this.getIconFromPriority = this.getIconFromPriority.bind(this);
        this.changeTicketPriority = this.changeTicketPriority.bind(this);
        this.changeTicketAssignedTo = this.changeTicketAssignedTo.bind(this);
        this.saveTimeEstimate = this.saveTimeEstimate.bind(this);

        this.state = {
            priorityAnchorEl: null,
            assignedToAnchorEl: null,

            editingTimeEstimate: null
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
        dispatchSetTicketPriority(project.id, ticket.ticketNumber, priority);
        this.setState({ priorityAnchorEl: null });
    }

    changeTicketAssignedTo(email: string) {
        const { project, ticket, dispatchSetTicketAssignedTo } = this.props;
        this.setState({ assignedToAnchorEl: null });
        const user = (email && project.users.find(({ user }) => user.email === email)) ? 
            project.users.find(({ user }) => user.email === email).user : null;
        dispatchSetTicketAssignedTo(project.id, ticket.ticketNumber, user);
    }

    saveTimeEstimate(e) {
        e.preventDefault();
        const { project, ticket, dispatchSetAlerts, dispatchSetTicketTimeEstimate } = this.props;
        const { editingTimeEstimate } = this.state;

        const time = validateTime(editingTimeEstimate);
        this.setState({ editingTimeEstimate: null });

        if (editingTimeEstimate === '') {
            dispatchSetTicketTimeEstimate(project.id, ticket.ticketNumber, '0m');
            return;
        }
        if (!time) {
            dispatchSetAlerts([{ type: 'error', message: 'Invalid time. Supported units are: minutes, hours, days, weeks, months' }]);
            return;
        }
        dispatchSetTicketTimeEstimate(project.id, ticket.ticketNumber, time);
    }

    render() {
        const { project, ticket, user } = this.props;
        const { priorityAnchorEl, assignedToAnchorEl, editingTimeEstimate } = this.state;
        const role = user.roles.find(r => r.projectId === project.id);

        return (
            <>
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
                        <Priority onClick={role.role !== 'Read-Only' ? 
                            (e) => this.setState({ priorityAnchorEl: e.currentTarget }) : 
                            null
                        }>
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
                            Time estimate:
                        </Typography>
                        <TimeEstimate>
                            <form action="" onSubmit={this.saveTimeEstimate}>
                                <TextField
                                    variant="standard"
                                    size="small"
                                    value={editingTimeEstimate === null ? ticket.timeEstimate : editingTimeEstimate}
                                    onChange={(e) => this.setState({ editingTimeEstimate: e.target.value })}
                                />
                                {editingTimeEstimate !== null && (
                                    <SaveButtons sx={{position: 'absolute', zIndex: 5}}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            sx={{ minWidth: '20px', padding: '6px' }}
                                            type="submit"
                                        >
                                            <DoneIcon />
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            sx={{ 
                                                minWidth: '20px', 
                                                padding: '6px', 
                                                backgroundColor: (theme) => `${theme.palette.background.paper} !important` 
                                            }}
                                            onClick={() => this.setState({ editingTimeEstimate: null })}
                                        >
                                            <CloseIcon />
                                        </Button>
                                    </SaveButtons>
                                ) }
                            </form>
                        </TimeEstimate>
                    </Detail>
                    <Detail>
                        <Typography
                            variant="body2"
                        >
                            Assigned to:
                        </Typography>
                        <AssignedTo onClick={(e) => this.setState({ assignedToAnchorEl: e.currentTarget })}>
                            <SmallAvatar>
                                {ticket.assignedUser ? ticket.assignedUser.firstName[0] : ticket.user.firstName[0]}
                            </SmallAvatar>
                            <Typography
                                noWrap
                                variant="body2"
                            >
                                {ticket.assignedUser ? 
                                ticket.assignedUser.firstName : 
                                ticket.user.firstName} {ticket.assignedUser ? 
                                ticket.assignedUser.lastName : 
                                ticket.user.lastName}
                            </Typography>
                        </AssignedTo>
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
                <Menu
                    anchorEl={assignedToAnchorEl}
                    open={Boolean(assignedToAnchorEl)}
                    onClose={(e) => this.setState({ assignedToAnchorEl: null })}
                >
                    { project.users && project.users.map(({ user }, i) => (
                        <MenuItem key={i} onClick={() => this.changeTicketAssignedTo(user.email)}>
                            <ListItemIcon>
                                <SmallAvatar>
                                    {user.firstName[0]}
                                </SmallAvatar>
                            </ListItemIcon>
                            <ListItemText>
                                <Typography
                                    noWrap
                                    variant="body2"
                                >
                                    {user.firstName} {user.lastName}
                                </Typography>
                            </ListItemText>
                        </MenuItem>
                    )) }
                </Menu>
            </>
        )
    }
}

const mapStateToProps = state => ({
    project: state.project.data,
    ticket: state.ticket.data,
    user: state.user.data
});

const mapDispatchToProps = dispatch => ({
    dispatchSetAlerts: (alerts) => dispatch(setAlerts(alerts)),
    dispatchSetTicketPriority: (projectId: string, ticketNumber: number, priority: string) => dispatch(setTicketPriority(projectId, ticketNumber, priority)),
    dispatchSetTicketAssignedTo: (projectId: string, ticketNumber: number, user: any) => dispatch(setTicketAssignedTo(projectId, ticketNumber, user)),
    dispatchSetTicketTimeEstimate: (projectId: string, ticketNumber: number, time: string) => dispatch(setTicketTimeEstimate(projectId, ticketNumber, time)),
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(TicketDetails);