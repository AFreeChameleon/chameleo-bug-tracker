import React from 'react';

import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';


// type TicketItemProps = {
//     ticket: any;
//     ref: any;
// }

const TicketContainer = styled('div')(({ theme }) => ({
    width: '100%',
    userSelect: "none",
    padding: 10,
    margin: "0 0 8px 0",
    '&:last-child': {
        marginBottom: 0
    },
    minHeight: "50px",
    backgroundColor: theme.palette.background.paper
}));

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}));

const PriorityDiv = styled('div')(({ theme }) => ({
    padding: '0px 10px',
    borderRadius: '25px',
    ...theme.typography.caption,
    color: theme.palette.primary.contrastText,
    fontSize: '10px'
}));

const TagList = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '10px'
}));

const Tag = styled('div')(({ theme }) => ({
    padding: '0px 10px',
    borderRadius: '25px',
    ...theme.typography.caption,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
}))

class TicketItem extends React.Component<any> {
    constructor(props) {
        super(props);

        this.formatPriority = this.formatPriority.bind(this);
    }

    formatPriority() {
        const { ticket } = this.props;

        switch (ticket.priority) {
            case 'Very low':
                return (
                    <PriorityDiv sx={{
                        backgroundColor: 'primary.dark'
                    }}>
                        { ticket.priority }
                    </PriorityDiv>
                )
            case 'Low':
                return (
                    <PriorityDiv sx={{
                        backgroundColor: 'primary.main'
                    }}>
                        { ticket.priority }
                    </PriorityDiv>
                )
            case 'Medium':
                return (
                    <PriorityDiv sx={{
                        backgroundColor: 'warning.light'
                    }}>
                        { ticket.priority }
                    </PriorityDiv>
                )
            case 'High':
                return (
                    <PriorityDiv sx={{
                        backgroundColor: 'error.main'
                    }}>
                        { ticket.priority }
                    </PriorityDiv>
                )
            case 'Critical':
                return (
                    <PriorityDiv sx={{
                        backgroundColor: 'error.dark'
                    }}>
                        { ticket.priority }
                    </PriorityDiv>
                )
            default:
                return (
                    <PriorityDiv sx={{
                        backgroundColor: 'primary.dark'
                    }}>
                        { ticket.priority }
                    </PriorityDiv>
                )
        }
    }

    render() {
        const { ticket, refEl, project, ...otherProps } = this.props;
        return (
            <TicketContainer 
                ref={refEl} 
                {...otherProps}
            >
                <Stack spacing={1}>
                    <FlexDiv>
                        <Typography
                            variant="body2"
                        >
                            {ticket.name}
                        </Typography>
                        {this.formatPriority()}
                    </FlexDiv>
                    <Typography
                        variant="caption"
                    >
                        {ticket.timeEstimate}
                    </Typography>
                    <FlexDiv sx={{
                        alignItems: 'flex-end',
                        marginTop: '0 !important'
                    }}>
                        <TagList>
                            <Tag>
                                TAGLIST
                            </Tag>
                        </TagList>
                        <Stack spacing={1}>
                            <Typography
                                variant="body2"
                            >
                                {project.key}-{ticket.id}
                            </Typography>
                            <Avatar sx={{ height: 32, width: 32, marginTop: '2px' }}>
                                {ticket.user.firstName && ticket.user.firstName.slice(0, 1)}
                            </Avatar>
                        </Stack>
                    </FlexDiv>
                </Stack>
            </TicketContainer>
        )
    }
}

export default TicketItem;