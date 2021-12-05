import React from "react";
import NextLink from 'next/link';

import { compose } from "redux";
import { connect } from "react-redux";

import {
    fetchTicketDetails
} from '../../../../redux/ticket/actions';
import {
    setArchivedTickets
} from '../../../../redux/project/actions';


import {
    styled,
    alpha
} from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';

import { 
    CriticalPriorityIcon, 
    HighPriorityIcon, 
    LowPriorityIcon, 
    MediumPriorityIcon 
} from "../Icons";

const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: '30px', 
    height: '30px', 
    fontSize: '17px'
}));

const CommentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '15px',
    marginTop: '15px'
}));

const Body = styled('div')(({ theme }) => ({
    display: 'grid',
    columnGap: '20px',
    gridTemplateColumns: 'auto 350px',
    marginTop: '20px',
}));

const Main = styled('div')(({ theme }) => ({
    width: '100%'
}));

const HeadingDiv = styled('div')(({ theme }) => ({
    marginTop: '50px',
}));

const LinkDiv = styled('div')(({ theme }) => ({
    textDecoration: 'underline'
}));

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}));

const TagList = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '15px',
    height: '60px'
}));

const Tag = styled('div')(({ theme }) => ({
    padding: '0 15px',
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: '5px'
}));

const CreatedBy = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
    width: 'fit-content',
    padding: '5px 10px',
}));

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
    padding: '5px 10px',
    width: 'fit-content',
    borderRadius: theme.shape.borderRadius,
}));

const AssignedTo = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '10px',
    alignItems: 'center',
    padding: '5px 10px',
    width: 'fit-content',
    borderRadius: theme.shape.borderRadius,
}));

const TimeEstimate = styled('div')(({ theme }) => ({
    maxWidth: '120px',
    marginLeft: '10px'
}));

const SmallerAvatar = styled(Avatar)(({ theme }) => ({
    width: '25px', 
    height: '25px', 
    fontSize: '15px'
}));

const ModalBody = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px 30px',
    width: '400px'
}));

const SmallButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    width: '100px'
}));

type TicketBodyProps = {
    project: any;
    ticket: any;
    user: any

    dispatchSetArchivedTickets: (id: string, ticketNumbers: number[], archived: boolean, refresh?: boolean) => void;
    dispatchFetchTicketDetails: (id: string, ticketNumber: number) => void;
}

type TicketBodyState = {
    restoreModalOpen: boolean;
}

class TicketBody extends React.Component<TicketBodyProps, TicketBodyState> {
    constructor(props) {
        super(props);

        this.getIconFromPriority = this.getIconFromPriority.bind(this);
        this.restoreTicket = this.restoreTicket.bind(this);

        this.state = {
            restoreModalOpen: false
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

    restoreTicket() {
        const {
            project,
            ticket,
            dispatchSetArchivedTickets,
            dispatchFetchTicketDetails
        } = this.props;

        dispatchSetArchivedTickets(project.id, [ticket.ticketNumber], false, true);

        this.setState({ restoreModalOpen: false });
    }

    render() {
        const { project, ticket, user } = this.props;
        const { restoreModalOpen } = this.state;

        return (
            <>
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
                        <NextLink
                            shallow
                            href={`/projects/${project.id}`}
                        >
                            <LinkDiv>
                                {project.name}
                            </LinkDiv>
                        </NextLink>
                        <LinkDiv>
                            {ticket.ticketNumber}
                        </LinkDiv>
                    </Breadcrumbs>
                    <FlexDiv sx={{marginTop: '35px'}}>
                        <Typography
                            variant="h1"
                        >
                            {ticket.name}
                        </Typography>
                    </FlexDiv>
                    <FlexDiv sx={{ marginTop: '15px' }}>
                        <TagList>
                            { ticket.tags.map(({tag}, i) => (
                                <Tag key={i}>
                                    {tag.name.toUpperCase()}
                                </Tag>
                            )) }
                        </TagList>
                        <Button
                            color="error"
                            variant="outlined"
                            onClick={() => this.setState({ restoreModalOpen: true })}
                        >
                            Restore
                        </Button>
                    </FlexDiv>
                    <Modal open={restoreModalOpen} onClose={() => this.setState({ restoreModalOpen: false })}>
                        <ModalBody>
                            <Typography
                                variant="h5"
                            >
                                Restore
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    marginTop: '30px'
                                }}
                            >
                                Are you sure you want to restore this ticket?
                            </Typography>
                            <FlexDiv sx={{ marginTop: '40px' }}>
                                <SmallButton
                                    variant="contained"
                                    sx={{
                                        width: '150px',
                                    }}
                                    onClick={this.restoreTicket}
                                >
                                    Restore
                                </SmallButton>
                                <SmallButton
                                    variant="outlined"
                                    sx={{
                                        width: '150px',
                                    }}
                                    onClick={() => this.setState({ restoreModalOpen: false })}
                                >
                                    Cancel
                                </SmallButton>
                            </FlexDiv>
                        </ModalBody>
                    </Modal>
                </HeadingDiv>
                <Body>
                    <Main>
                        <Typography
                            variant="body1"
                        >
                            {ticket.description}
                        </Typography>
                        {ticket.comments.length > 0 && <Main sx={{ marginTop: '30px' }}>
                            <Typography
                                variant="subtitle1"
                            >
                                Feedback
                            </Typography>
                            { ticket.comments.map((comment, i) => {
                                return (
                                    <CommentContainer key={i}>
                                        <SmallAvatar>
                                            {comment.user.firstName[0].toUpperCase()}
                                        </SmallAvatar>
                                        <Box>
                                            <Box display="flex" columnGap="15px">
                                                <Typography 
                                                    variant="subtitle1" 
                                                    sx={{ lineHeight: '1.5' }}
                                                >
                                                    {comment.user.firstName} {comment.user.lastName}
                                                </Typography>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ lineHeight: '1.8' }}
                                                >
                                                    {(new Date(comment.createdAt)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </Typography>
                                            </Box>
                                            <Box marginTop="5px">
                                                <Typography>
                                                    {comment.message}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CommentContainer>
                                )
                            }) }
                        </Main>}
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
                            <Priority>
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
                                <Typography variant="body1">
                                    {ticket.timeEstimate}
                                </Typography>
                            </TimeEstimate>
                        </Detail>
                        <Detail>
                            <Typography
                                variant="body2"
                            >
                                Assigned to:
                            </Typography>
                            <AssignedTo>
                                <SmallerAvatar>
                                    {ticket.user.firstName[0]}
                                </SmallerAvatar>
                                <Typography
                                    noWrap
                                    variant="body2"
                                >
                                    {ticket.user.firstName} {ticket.user.lastName}
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
                                <SmallerAvatar>
                                    {ticket.user.firstName[0]}
                                </SmallerAvatar>
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
    dispatchSetArchivedTickets: (id: string, ticketNumbers: number[], archived: boolean, refresh?: boolean) => dispatch(setArchivedTickets(id, ticketNumbers, archived, refresh)),
    dispatchFetchTicketDetails: (id: string, ticketNumber: number) => dispatch(fetchTicketDetails(id, ticketNumber))
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(TicketBody);