import type { DraggableProvided } from "@hello-pangea/dnd";
import { DotsSix, EllipsisHorizontal } from "@medusajs/icons";
import { Text, Button, IconButton, Drawer, Table } from "@medusajs/ui";
import type { NewNavItemResponse } from "src/admin/routes/poverty/page";

const navRow = ({ item }: { item: NewNavItemResponse["data"][number] }) => {
  return (provided: DraggableProvided) => (
    <Table.Row
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap h-[50px]"
    >
      <Table.Cell>
        <DotsSix />
      </Table.Cell>
      <Table.Cell>{item.title}</Table.Cell>
      <Table.Cell>{item.content.slug}</Table.Cell>
      <Table.Cell>
        <IconButton variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </Table.Cell>
    </Table.Row>
  );
};

export default navRow;
