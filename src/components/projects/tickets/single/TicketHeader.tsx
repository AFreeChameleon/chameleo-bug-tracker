import React from "react";
import NextLink from 'next/link';
import _ from 'lodash';
import { compose } from "redux";
import { connect } from "react-redux";

import {
    styled,
    alpha
} from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import DoneIcon from '@mui/icons-material/Done';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import MoreIcon from '@mui/icons-material/MoreHoriz';
import ArchiveIcon from '@mui/icons-material/ArchiveOutlined';

import { 
    saveTicketTags,
    setTicketName,
    archiveTicket
} from "../../../../redux/ticket/actions";

const HeadingDiv = styled('div')(({ theme }) => ({
    marginTop: '50px',
}));

const LinkDiv = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    textDecoration: 'underline'
}));

const HeaderInput = styled('input')(({ theme }) => ({
    ...theme.typography.h1,
    width: 'calc(100% + 5px)',
    border: 'none',
    outline: 'none',
    transition: '0.2s',
    padding: '5px 5px',
    borderRadius: theme.shape.borderRadius,
    marginLeft: '-5px',
    '&:hover': {
        backgroundColor: theme.palette.grey['200']
    }
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
    marginTop: '10px',
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

const EditTag = styled('div')(({ theme }) => ({
    fontSize: theme.typography.body2.fontSize,
    fontWeight: 500,
    textDecoration: 'underline',
    cursor: 'pointer'
}));

const SaveTagsButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    width: '70px',
    height: '30px'
}));

const SaveButtons = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '15px',
    position: 'absolute',
    zIndex: 5,
    marginTop: '50px'
}));

const SaveButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    width: '70px',
}));

type TicketHeaderProps = {
    project: any;
    ticket: any;

    dispatchSaveTicketTags: (projectId: string, ticketNumber: number, tags: any[]) => void;
    dispatchSetTicketName: (projectId: string, ticketNumber: number, name: string) => void;
    dispatchArchiveTicket: (projectId: string, ticketNumber: number, archive: boolean) => void;
};

type TicketHeaderState = {
    editingTagsOpen: boolean;
    editingTags: any[];
    editingName: null | string;
    moreOptionsEl: null | HTMLElement;
};

class TicketHeader extends React.Component<TicketHeaderProps, TicketHeaderState> {
    constructor(props) {
        super(props);
        
        this.addTag = this.addTag.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.saveTags = this.saveTags.bind(this);
        this.saveName = this.saveName.bind(this);
        this.archiveTicket = this.archiveTicket.bind(this);

        this.state = {
            editingTagsOpen: false,
            editingTags: [],
            editingName: null,

            moreOptionsEl: null
        }
    }

    addTag(e) {
        const { project, ticket } = this.props;
        const { editingTags } = this.state;
        const ticketId = e.target.value;
        console.log(ticketId, project.tags);

        this.setState({ editingTags: _.uniq([ ...editingTags, project.tags.find((tag) => tag.id === ticketId) ]) })
    }

    removeTag(id: number) {
        const { editingTags } = this.state;
        this.setState({ editingTags: [ ...editingTags.filter(t => t.id !== id) ] })
    }

    saveTags(e) {
        const { project, ticket, dispatchSaveTicketTags } = this.props;
        const { editingTags } = this.state;

        dispatchSaveTicketTags(project.id, ticket.ticketNumber, editingTags);
        this.setState({ editingTagsOpen: false });
    }

    saveName(e) {
        e.preventDefault();
        const { project, ticket, dispatchSetTicketName } = this.props;
        const { editingName } = this.state;

        dispatchSetTicketName(project.id, ticket.ticketNumber, editingName);
        this.setState({ editingName: null });
    }

    archiveTicket() {
        const { project, ticket, dispatchArchiveTicket } = this.props;

        dispatchArchiveTicket(project.id, ticket.ticketNumber, true);
        this.setState({ moreOptionsEl: null });
    }

    render() {
        const { project, ticket } = this.props;
        const { editingTagsOpen, editingTags, editingName, moreOptionsEl } = this.state;

        console.log(ticket, project)
        
        return (
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
                <FlexDiv sx={{marginTop: '30px'}}>
                    <Box 
                        component="form" 
                        action="" 
                        sx={{ 
                            width: '100%', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'flex-end' 
                        }}
                        onSubmit={this.saveName}
                    >
                        <HeaderInput
                            value={editingName === null ? ticket.name : editingName}
                            onChange={(e) => this.setState({ editingName: e.target.value })}
                        />
                        {editingName !== null && (
                            <SaveButtons>
                                <Button
                                    variant="contained"
                                    color="primary"
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
                                    onClick={() => this.setState({ editingName: null })}
                                >
                                    <CloseIcon />
                                </Button>
                            </SaveButtons>
                        )}
                    </Box>
                </FlexDiv>
                <FlexDiv>
                    { !editingTagsOpen ? (<TagList>
                        { ticket.tags.map(({tag}, i) => (
                            <Tag key={i}>
                                {tag.name.toUpperCase()}
                            </Tag>
                        )) }
                        <EditTag onClick={(e) => this.setState({ editingTagsOpen: true, editingTags: [ ...ticket.tags.map((t) => t.tag) ] })} >
                            Edit tags
                        </EditTag>
                    </TagList>) : (<TagList>
                        { editingTags.map((tag, i) => (
                            <Tag key={i}>
                                {tag.name.toUpperCase()}
                                <CloseIcon 
                                    onClick={(e) => this.removeTag(tag.id)}
                                    sx={{ 
                                        width: '15px', 
                                        height: '15px', 
                                        cursor: 'pointer' 
                                    }} 
                                />
                            </Tag>
                        )) }
                        <FormControl variant="standard" size="small" sx={{ width: '200px', marginBottom: '15px' }}>
                            <InputLabel id="add-tag-label">Add Tag...</InputLabel>
                            <Select
                                labelId="add-tag-label"
                                value={''}
                                onChange={this.addTag}
                                placeholder="Add Tag..."
                            >
                                { project.tags.map((tag, i) => (
                                    <MenuItem value={tag.id} key={i}>{tag.name}</MenuItem>
                                )) }
                            </Select>
                        </FormControl>
                        <SaveTagsButton 
                            variant="contained"
                            onClick={this.saveTags} 
                        >
                            Save
                        </SaveTagsButton>
                        <SaveTagsButton 
                            variant="outlined"
                            onClick={(e) => this.setState({ editingTagsOpen: false })} 
                        >
                            Cancel
                        </SaveTagsButton>
                    </TagList>) }
                    <IconButton
                        onClick={(e) => this.setState({ moreOptionsEl: e.currentTarget })}
                    >
                        <MoreIcon />
                    </IconButton>
                </FlexDiv>
                <Menu
                    open={Boolean(moreOptionsEl)}
                    anchorEl={moreOptionsEl}
                    onClose={() => this.setState({ moreOptionsEl: null })}
                >
                    <MenuItem onClick={this.archiveTicket}>
                        <ListItemIcon>
                            <ArchiveIcon />
                        </ListItemIcon>
                        <ListItemText>
                            Archive
                        </ListItemText>
                    </MenuItem>
                </Menu>
            </HeadingDiv>
        )
    }
}

const mapStateToProps = state => ({
    project: state.project.data,
    ticket: state.ticket.data
});

const mapDispatchToProps = dispatch => ({
    dispatchSaveTicketTags: (projectId: string, ticketNumber: number, tags: any[]) => dispatch(saveTicketTags(projectId, ticketNumber, tags)),
    dispatchSetTicketName: (projectId: string, ticketNumber: number, name: string) => dispatch(setTicketName(projectId, ticketNumber, name)),
    dispatchArchiveTicket: (projectId: string, ticketNumber: number, archive: boolean) => dispatch(archiveTicket(projectId, ticketNumber, archive))
});

export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(TicketHeader);