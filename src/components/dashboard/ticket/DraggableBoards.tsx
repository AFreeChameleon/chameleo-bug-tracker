import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

type DraggableBoardsProps = {
    tickets: any[];
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
    alignItems: 'center'
}));

const DroppablePaper = styled(Paper)(({ theme }) => ({
    width: '250px',
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
console.log(this.props.tickets)
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
    ]

    filterTickets() {
        const { tickets } = this.props;
        console.log(tickets)
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

    setColumns() {

    }

    onDragEnd(result, columns, setColumns) {
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
        }
    }

    render() {
        const { tickets } = this.state;
        // console.log('tickets: ', tickets)
        if (!tickets) {
            return null;
        }
        // const formattedTickets = this.formatTickets();
        // console.log(tickets)
        return (
            <DragDropContext
                onDragEnd={(result) => this.onDragEnd(result, tickets, (cols: any) => this.setState({ tickets: cols }))}
            >
                <FlexDiv sx={{
                    marginTop: '50px'
                }}>
                    { Object.entries(tickets).map(([columnId, column]: any, i) => {console.log(tickets[columnId],columnId); return (
                        <CenterDiv key={i}>
                            <Typography
                                gutterBottom
                                variant="h5"
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
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            userSelect: "none",
                                                            padding: 16,
                                                            margin: "0 0 8px 0",
                                                            minHeight: "50px",
                                                            backgroundColor: snapshot.isDragging
                                                            ? "#263B4A"
                                                            : "#456C86",
                                                            color: "white",
                                                            ...provided.draggableProps.style
                                                        }}
                                                    >
                                                        {ticket.name}
                                                    </div>
                                                ) }
                                            </Draggable>
                                        )) }
                                        {provided.placeholder}
                                    </DroppablePaper>
                                )}
                            </Droppable>
                        </CenterDiv>
                    )}) }
                </FlexDiv>
            </DragDropContext>
        )
    }
}

const mapStateToProps = (state) => ({
    tickets: state.project.data.tickets
})


export default compose<any>(
    connect(mapStateToProps)
)(DraggableBoards);