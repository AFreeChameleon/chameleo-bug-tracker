import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import _ from 'lodash';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import MoreIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import TicketItem from './TicketItem';
import EditColumnModal from './EditColumnModal';
import { setProjectDetails } from '../../../redux/project/actions';

type DraggableBoardsProps = {
    tickets: any[];
    project: any;

    dispatchSetProjectDetails: (id: string, details: any) => void;
}

type DraggableBoardsState = {
    tickets: any;
    colMenuAnchorEl: any;
    editingColumn: any;
}

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
}))

const CenterDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px',
    width: '25%',
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
    height: '500px',
    padding: '5px',
    backgroundColor: theme.palette.grey['50'],
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
}));

const Container = styled('div')(({ theme }) => ({
    width: '100%'
}));

class DraggableBoards extends React.Component<DraggableBoardsProps, DraggableBoardsState> {
    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
        
        this.state = {
            tickets: {},
            colMenuAnchorEl: null,
            editingColumn: null
        }
    }

    // async setColumns(source: any, destination: any, columns: any) {
    //     const ticket = columns[source.droppableId].items[source.index];
    //     const res = await axios.patch('/api/ticket/change-status', {
    //         ticket_id: ticket.id,
    //         status: this.colNames.findIndex(c => c === destination.droppableId)
    //     }, { withCredentials: true });
    // }

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
        }
        return;
        // if (source.droppableId !== destination.droppableId) {
        //     const sourceColumn = columns[source.droppableId];
        //     const destColumn = columns[destination.droppableId];
        //     const sourceItems = [...sourceColumn.items];
        //     const destItems = [...destColumn.items];
        //     const [removed] = sourceItems.splice(source.index, 1);
        //     destItems.splice(destination.index, 0, removed);
        //     this.setState({ 
        //         tickets: {
        //             ...columns,
        //             [source.droppableId]: {
        //               ...sourceColumn,
        //               items: sourceItems
        //             },
        //             [destination.droppableId]: {
        //               ...destColumn,
        //               items: destItems
        //             }
        //         }
        //     })
        //     await this.setColumns(source, destination, columns);
        // } else {
        //     const column = columns[source.droppableId];
        //     const copiedItems = [...column.items];
        //     const [removed] = copiedItems.splice(source.index, 1);
        //     copiedItems.splice(destination.index, 0, removed);
        //     this.setState({
        //         tickets: {
        //             ...columns,
        //             [source.droppableId]: {
        //               ...column,
        //               items: copiedItems
        //             }
        //         }
        //     })
        //     await this.setColumns(source, destination, columns);
        // }
    }

    render() {
        const { project } = this.props;
        const { tickets, colMenuAnchorEl, editingColumn } = this.state;
        if (!tickets) {
            return null;
        }
        // const formattedTickets = this.formatTickets();
        console.log(colMenuAnchorEl, project)
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
                                sx={{
                                    marginTop: '50px',
                                }}
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
                                                    <IconButton color="inherit" id={`column-${columnId}`} onClick={(e) => this.setState({ colMenuAnchorEl: e.currentTarget })}>
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
                    <MenuItem>
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