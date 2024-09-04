import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  type ResponderProvided,
} from "@hello-pangea/dnd";
import { Heading, Table } from "@medusajs/ui";
import { useState } from "react";
import type { NewNavItemResponse } from "src/admin/routes/poverty/page";
import navRow from "./navRow";

const NavTable = ({
  title,
  items: defaultItems,
  DrawerEl,
}: {
  title: string;
  items: NewNavItemResponse["data"][];
  DrawerEl: React.ComponentType<{
    drawerTitle: string;
    drawerDescription: string;
  }>;
}) => {
  const [items, setItems] =
    useState<NewNavItemResponse["data"][]>(defaultItems);

  function handleDragEnd(result: DropResult, provided: ResponderProvided) {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [newReorderedItems] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, newReorderedItems);
    setItems(newItems);
  }

  return (
    <div className="pb-4">
      <DrawerEl drawerTitle="" drawerDescription="" />
      <div className="flex justify-between px-6 py-4">
        <Heading level="h1">{title}</Heading>
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
                {items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {navRow({ item })}
                  </Draggable>
                ))}
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
