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
import Typography from '@mui/material/Typography';
import TicketItem from './TicketItem';

type DraggableBoardsProps = {
    tickets: any[];
    project: any;
}

type DraggableBoardsState = {
    tickets: any;
}

const FlexDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '20px'
}))

const CenterDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '25%'
}));

const DroppablePaper = styled(Paper)(({ theme }) => ({
    width: '100%',
    minHeight: '150px',
    padding: '5px',
    backgroundColor: theme.palette.grey['50']
}))

class DraggableBoards extends React.Component<DraggableBoardsProps, DraggableBoardsState> {
    constructor(props) {
        super(props);
        this.filterTickets = this.filterTickets.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.formatTickets = this.formatTickets.bind(this);
        
        this.state = {
            tickets: {
                ...this.formatTickets()
            }
        }
    }

    colNames = [
        'Todo',
        'In progress',
        'Waiting for review',
        'Done'
    ];

    componentDidUpdate(prevProps) {
        const { tickets } = this.props;
        if (!_.isEqual(tickets, prevProps.tickets)) {
            this.setState({
                tickets: {
                    ...this.formatTickets()
                }
            })
        }
    }

    filterTickets() {
        const { tickets } = this.props;
        const todoTickets = tickets.filter(t => t.status === 'Todo');
        const inProgressTickets = tickets.filter(t => t.status === 'In progress');
        const waitingForReviewTickets = tickets.filter(t => t.status === 'Waiting for review');
        const doneTickets = tickets.filter(t => t.status === 'Done');
        return {
            todoTickets,
            inProgressTickets,
            waitingForReviewTickets,
            doneTickets
        }
    }

    formatTickets() {
        const { tickets } = this.props;
        const { todoTickets, inProgressTickets, waitingForReviewTickets, doneTickets } = this.filterTickets();
        return tickets ? {
            'Todo': {
                name: 'Todo',
                items: todoTickets
            },
            'In progress': {
                name: 'In progress',
                items: inProgressTickets
            },
            'Waiting for review': {
                name: 'Waiting for review',
                items: waitingForReviewTickets
            },
            'Done': {
                name: 'Done',
                items: doneTickets
            }
        } : {
            'Todo': {
                name: 'Todo',
                items: []
            },
            'In progress': {
                name: 'In progress',
                items: []
            },
            'Waiting for review': {
                name: 'Waiting for review',
                items: []
            },
            'Done': {
                name: 'Done',
                items: []
            }
        }
    }

    async setColumns(source: any, destination: any, columns: any) {
        const ticket = columns[source.droppableId].items[source.index];
        const res = await axios.patch('/api/ticket/change-status', {
            ticket_id: ticket.id,
            status: this.colNames.findIndex(c => c === destination.droppableId)
        }, { withCredentials: true });
    }

    async onDragEnd(result, columns, setColumns) {
        if (!result.destination) return;
        const { source, destination } = result;
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            this.setState({ 
                tickets: {
                    ...columns,
                    [source.droppableId]: {
                      ...sourceColumn,
                      items: sourceItems
                    },
                    [destination.droppableId]: {
                      ...destColumn,
                      items: destItems
                    }
                }
            })
            await this.setColumns(source, destination, columns);
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            this.setState({
                tickets: {
                    ...columns,
                    [source.droppableId]: {
                      ...column,
                      items: copiedItems
                    }
                }
            })
            await this.setColumns(source, destination, columns);
        }
    }

    render() {
        const { project } = this.props;
        const { tickets } = this.state;
        if (!tickets) {
            return null;
        }
        // const formattedTickets = this.formatTickets();
        return (
            <DragDropContext
                onDragEnd={(result) => this.onDragEnd(result, tickets, (cols: any) => this.setState({ tickets: cols }))}
            >
                <FlexDiv sx={{
                    marginTop: '50px'
                }}>
                    { Object.entries(tickets).map(([columnId, column]: any, i) => (
                        <CenterDiv key={i}>
                            <Typography
                                variant="h5"
                                sx={{ marginBottom: '20px' }}
                            >
                                {column.name}
                            </Typography>
                            <Droppable droppableId={columnId} key={columnId}>
                                {(provided, snapshot) => (
                                    <DroppablePaper
                                        variant="outlined"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        { tickets[columnId].items.map((ticket, i) => (
                                            <Draggable
                                                key={ticket.name}
                                                draggableId={ticket.name}
                                                index={i}
                                            >
                                                {(provided, snapshot) => (
                                                    <TicketItem
                                                        project={project}
                                                        ticket={ticket}
                                                        refEl={provided.innerRef}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                        }}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    />
                                                ) }
                                            </Draggable>
                                        )) }
                                        {provided.placeholder}
                                    </DroppablePaper>
                                )}
                            </Droppable>
                        </CenterDiv>
                    )) }
                </FlexDiv>
            </DragDropContext>
        )
    }
}

const mapStateToProps = (state) => ({
    tickets: state.project.data.tickets,
    project: state.project.data
})


export default compose<any>(
    connect(mapStateToProps)
)(DraggableBoards);