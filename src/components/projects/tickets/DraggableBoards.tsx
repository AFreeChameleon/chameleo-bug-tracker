import React from 'react';
import _ from 'lodash';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { setProjectDetails } from '../../../redux/project/actions';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import MoreIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import TicketItem from './TicketItem';
import EditColumnModal from './EditColumnModal';
import DeleteColumnModal from './DeleteColumnModal';
import CreateColumn from './CreateColumn';

type DraggableBoardsProps = {
    tickets: any[];
    project: any;

    dispatchSetProjectDetails: (id: string, details: any) => void;
}

type DraggableBoardsState = {
    tickets: any;
    colMenuAnchorEl: any;
    editingColumn: any;
    deletingColumn: any;
}

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    width: 'calc(100vw - 350px)',
}))

const CenterDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minWidth: '300px',
    maxWidth: '300px',
    marginRight: '20px'
}));

const ColumnHeader = styled(Box)(({ theme }: any) => ({
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '10px',
    color: 'white',
    padding: '2px 0px 2px 15px',
    borderTopLeftRadius: '6px',
    borderTopRightRadius: '6px',
}));

const DroppablePaper = styled(Paper)(({ theme }) => ({
    width: '100%',
    minHeight: '500px',
    padding: '5px',
    backgroundColor: theme.palette.grey['50'],
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
    overflow: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
        width: '5px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#B7B7B7',
        borderRadius: '5px'
    },
}));

const Container = styled('div')(({ theme }) => ({
    marginTop: '50px', 
    overflowX: 'auto', 
    width: 'calc(100vw - 350px)',
    height: 'fit-content',
    '::-webkit-scrollbar': {
        width: '7px',
        height: '7px',
    },
    '::-webkit-scrollbar-track': {
        background: '#f1f1f1'
    },
    '::-webkit-scrollbar-thumb': {
        background: '#B7B7B7',
        borderRadius: '10px'
    },
    '::-webkit-scrollbar-thumb:hover': {
        background: '#888888'
    }
}));

class DraggableBoards extends React.Component<DraggableBoardsProps, DraggableBoardsState> {
    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
        
        this.state = {
            tickets: {},
            colMenuAnchorEl: null,

            editingColumn: null,
            deletingColumn: null
        }
    }

    async onDragEnd(result) {
        if (!result.destination) return;
        const { source, destination } = result;
        const { project, dispatchSetProjectDetails } = this.props;
        let editableProject = _.cloneDeep(project);
        if (destination.droppableId === 'all-columns') {
            let columnOrder = editableProject.details.columnOrder;
            columnOrder.splice(destination.index, 0, columnOrder.splice(source.index, 1)[0]);
            editableProject.details.columnOrder = columnOrder;
            dispatchSetProjectDetails(project.id, editableProject.details);
        } else {
            let sourceColumn = editableProject.details.columns[source.droppableId];
            let destColumn = editableProject.details.columns[destination.droppableId];
            const id = sourceColumn.ticketIds.splice(source.index, 1)[0];
            destColumn.ticketIds.splice(destination.index, 0, id);
            dispatchSetProjectDetails(project.id, editableProject.details);
        }
    }

    render() {
        const { project, tickets } = this.props;
        const { colMenuAnchorEl, editingColumn, deletingColumn } = this.state;
        return (
            <DragDropContext
                onDragEnd={this.onDragEnd}
            >
                <Container>
                    <Droppable
                        droppableId="all-columns"
                        direction="horizontal"
                        type="column"
                    >
                        { (columnProvided, columnSnapshot) => (
                            <FlexDiv 
                                {...columnProvided.droppableProps}
                                ref={columnProvided.innerRef}
                            >
                                { project.details && project.details.columnOrder.map((columnId, i) => (
                                    <Draggable draggableId={columnId} index={i} key={columnId}>
                                        {(columnDraggableProvided) => (
                                            <CenterDiv key={i} {...columnDraggableProvided.draggableProps} ref={columnDraggableProvided.innerRef}>
                                                <ColumnHeader {...columnDraggableProvided.dragHandleProps}>
                                                    <Typography
                                                        variant="subtitle2"
                                                    >
                                                        {project.details.columns[columnId].name.toUpperCase()}
                                                    </Typography>
                                                    <IconButton 
                                                        color="inherit" 
                                                        id={`column-${columnId}`} 
                                                        onClick={(e) => this.setState({ colMenuAnchorEl: e.currentTarget })}
                                                    >
                                                        <MoreIcon />
                                                    </IconButton>
                                                </ColumnHeader>
                                                <Droppable droppableId={columnId} key={columnId}>
                                                    {(cardProvided, snapshot) => (
                                                        <DroppablePaper
                                                            variant="elevation"
                                                            elevation={0}
                                                            {...cardProvided.droppableProps}
                                                            ref={cardProvided.innerRef}
                                                        >
                                                            { project.details.columns[columnId].ticketIds.map((ticketId, i) => {
                                                                const ticket = tickets.find(t => t.id === ticketId);
                                                                console.log(ticket)
                                                                if (!ticket) {
                                                                    return null;
                                                                }
                                                                return (
                                                                    <Draggable
                                                                        key={ticket.name}
                                                                        draggableId={ticket.name}
                                                                        index={i}
                                                                    >
                                                                        {(cardDraggableProvided, snapshot) => (
                                                                            <TicketItem
                                                                                project={project}
                                                                                ticket={ticket}
                                                                                refEl={cardDraggableProvided.innerRef}
                                                                                style={{
                                                                                    ...cardDraggableProvided.draggableProps.style,
                                                                                }}
                                                                                {...cardDraggableProvided.draggableProps}
                                                                                {...cardDraggableProvided.dragHandleProps}
                                                                            />
                                                                        ) }
                                                                    </Draggable>
                                                            ) }) }
                                                            {cardProvided.placeholder}
                                                        </DroppablePaper>
                                                    )}
                                                </Droppable>
                                            </CenterDiv>
                                        )}
                                    </Draggable>
                                )) }
                                {columnProvided.placeholder}
                                {/* CREATE COLUMN */}
                                <CreateColumn />
                            </FlexDiv>
                        )}
                    </Droppable>
                </Container>
                <Menu
                    anchorEl={colMenuAnchorEl}
                    open={Boolean(colMenuAnchorEl)}
                    onClose={() => this.setState({ colMenuAnchorEl: null })}
                    onClick={() => this.setState({ colMenuAnchorEl: null })}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 22,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={(e) => this.setState({
                        editingColumn: colMenuAnchorEl.id.split('-')[1]
                    })}>
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        Edit
                    </MenuItem>
                    <MenuItem onClick={(e) => this.setState({
                        deletingColumn: colMenuAnchorEl.id.split('-')[1]
                    })}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <Typography
                            color="error"
                        >
                            Destroy
                        </Typography>
                    </MenuItem>
                </Menu>
                <EditColumnModal
                    open={Boolean(editingColumn)}
                    onClose={() => this.setState({ editingColumn: null })}
                    columnId={editingColumn}
                />
                {Boolean(deletingColumn) && <DeleteColumnModal
                    open={Boolean(deletingColumn)}
                    onClose={() => this.setState({ deletingColumn: null })}
                    columnId={deletingColumn}
                />}
            </DragDropContext>
        )
    }
}

const mapStateToProps = (state) => ({
    tickets: state.project.data.tickets,
    project: state.project.data
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetProjectDetails: (id: string, details: any) => dispatch(setProjectDetails(id, details))
})


export default compose<any>(
    connect(mapStateToProps, mapDispatchToProps)
)(DraggableBoards);