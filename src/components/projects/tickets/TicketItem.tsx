import React from 'react';
import NextLink from 'next/link';

import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';

import AddIcon from '@mui/icons-material/Add';
import { CriticalPriorityIcon, HighPriorityIcon, LowPriorityIcon, MediumPriorityIcon } from './Icons';

// type TicketItemProps = {
//     ticket: any;
//     ref: any;
// }

const TicketContainer = styled('div')(({ theme }) => ({
    width: '100%',
    userSelect: "none",
    padding: 10,
    margin: "0 0 8px 0",
    minHeight: '120px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer !important',
    transition: 'box-shadow 0.2s',
    '&:hover': {
        boxShadow: theme.shadows[4],
    }
}));

const SourceTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
}));

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}));

const TagList = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '10px',
    alignItems: 'center',
    height: '30px'
}));

const Tag = styled('div')(({ theme }) => ({
    padding: '0px 10px',
    borderRadius: '25px',
    ...theme.typography.caption,
    border: `1px solid ${theme.palette.primary.dark}`,
    height: 'fit-content'
}));

const FlexGrow = styled('div')(({ theme }) => ({
    flexGrow: 1
}));

const TimeEstimate = styled(Typography)(({ theme }) => ({
    padding: '0 10px',
    borderRadius: '20px',
    backgroundColor: theme.palette.grey['200']
}));

class TicketItem extends React.Component<any> {
    constructor(props) {
        super(props);

        this.formatPriority = this.formatPriority.bind(this);
    }

    formatPriority() {
        const { ticket } = this.props;

        switch (ticket.priority) {
            case 'Low':
                return (
                    <LowPriorityIcon />
                );
            case 'Medium':
                return (
                    <MediumPriorityIcon />
                );
            case 'High':
                return (
                    <HighPriorityIcon />
                );
            case 'Critical':
                return (
                    <CriticalPriorityIcon />
                );
            default:
                return (
                    <MediumPriorityIcon />
                );
        }
    }

    render() {
        const { ticket, refEl, project, ...otherProps } = this.props;
        // console.log(ticket)
        return (
            <NextLink href={`/projects/${project.id}/tickets/${ticket.ticketNumber}`}>
                <TicketContainer 
                    ref={refEl} 
                    {...otherProps}
                >
                    <FlexDiv sx={{ paddingRight: '5px' }}>
                        <Typography
                            variant="body1"
                        >
                            {ticket.name}
                        </Typography>
                        {this.formatPriority()}
                    </FlexDiv>
                    <Box marginTop="5px">
                        {ticket.source !== 'website' && 
                        <SourceTypography
                            variant="caption"
                        >
                            From: {ticket.source}
                        </SourceTypography>}
                        <FlexDiv>
                            <TagList>
                                {(ticket.tags && ticket.tags.length > 0) ? ticket.tags.map((tag, i) => (
                                    <Chip label={tag.tag.name} color="primary" size="small"/>
                                )) : (
                                    <Tag sx={{border: 'none'}}></Tag>
                                )}
                            </TagList>
                        </FlexDiv>
                    </Box>
                    <FlexGrow />
                    <FlexDiv>
                        <TimeEstimate
                            variant="subtitle2"
                        >
                            {ticket.timeEstimate}
                        </TimeEstimate>
                        <Tooltip title={ticket.user.firstName + ' ' + ticket.user.lastName}>
                            <Avatar sx={{ height: 30, width: 30, marginTop: '2px', fontSize: '18px', marginLeft: 'auto !important' }}>
                                {ticket.user.firstName && ticket.user.firstName.slice(0, 1)}
                            </Avatar>
                        </Tooltip>
                    </FlexDiv>
                </TicketContainer>
            </NextLink>
        )
    }
}

export default TicketItem;