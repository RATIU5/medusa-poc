import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  type ResponderProvided,
} from "@hello-pangea/dnd";
import { Heading, Table } from "@medusajs/ui";
import type { NewNavItemResponse } from "src/admin/routes/poverty/page";
import navRow from "./navRow";

const NavTable = ({
  title,
  items,
  DrawerEl,
  isPending,
  isFetching,
  error,
}: {
  title: string;
  items: NewNavItemResponse["data"];
  DrawerEl: React.ComponentType;
  isPending: boolean;
  isFetching: boolean;
  error: Error;
}) => {
  function handleDragEnd(result: DropResult, provided: ResponderProvided) {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [newReorderedItems] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, newReorderedItems);
  }

  if (isPending || isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Heading level="h2">Loading items...</Heading>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Heading level="h2">Error loading items</Heading>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="flex justify-between px-6 py-4">
        <Heading level="h1">{title}</Heading>
        <DrawerEl />
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Page Title</Table.HeaderCell>
            <Table.HeaderCell>Page Slug</Table.HeaderCell>
            <Table.HeaderCell className="text-right" />
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="items">
            {(provided) => (
              <Table.Body ref={provided.innerRef} {...provided.droppableProps}>
                {items.map((item, index) => {
                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {navRow({ item })}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </Table.Body>
            )}
          </Droppable>
        </DragDropContext>
      </Table>
    </div>
  );
};

export default NavTable;
