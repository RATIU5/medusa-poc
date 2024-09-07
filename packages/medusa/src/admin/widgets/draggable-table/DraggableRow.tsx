import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table, IconButton } from "@medusajs/ui";
import { flexRender, Row } from "@tanstack/react-table";
import { DotsSix, EllipsisHorizontal } from "@medusajs/icons";

interface DraggableRowProps<T> {
  row: Row<T>;
  isActive: boolean;
  animationOffset: number;
}

const DraggableRow = <T extends { id: string }>({
  row,
  isActive,
  animationOffset,
}: DraggableRowProps<T>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.original.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(
      transform
        ? { ...transform, y: transform.y + animationOffset }
        : { y: animationOffset }
    ),
    transition: [transition, animationOffset ? "transform 300ms ease" : ""]
      .filter(Boolean)
      .join(", "),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isActive ? 1 : 0,
    position: isActive ? "relative" : "static",
  };

  return (
    <Table.Row ref={setNodeRef} style={style}>
      <Table.Cell className="w-[40px] p-0">
        <div
          {...attributes}
          {...listeners}
          className="flex h-full w-full cursor-move items-center justify-center"
        >
          <DotsSix />
        </div>
      </Table.Cell>
      {row.getVisibleCells().map((cell) => (
        <Table.Cell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Table.Cell>
      ))}
      <Table.Cell className="w-[40px] p-0">
        <IconButton variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </Table.Cell>
    </Table.Row>
  );
};

export default DraggableRow;
