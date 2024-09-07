import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table, IconButton } from "@medusajs/ui";
import { flexRender, Row } from "@tanstack/react-table";
import { DotsSix, EllipsisHorizontal } from "@medusajs/icons";

interface DraggableRowProps<T> {
  row: Row<T>;
  isActive: boolean;
  isDragOverlay?: boolean;
}

const DraggableRow = <T extends { id: string }>({
  row,
  isActive,
  isDragOverlay = false,
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
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isActive ? 1 : 0,
    position: isDragOverlay ? "relative" : undefined,
    boxShadow: isDragOverlay
      ? "0 0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px 0 rgba(34, 33, 81, 0.15)"
      : undefined,
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
