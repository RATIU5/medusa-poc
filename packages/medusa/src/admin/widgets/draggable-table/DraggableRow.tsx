import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table } from "@medusajs/ui";
import { flexRender, Row } from "@tanstack/react-table";
import { DotsSix } from "@medusajs/icons";

interface DraggableRowProps<T> {
  row: Row<T>;
  isDragOverlay?: boolean;
  actionDrawer?: (data: Row<T>) => React.ReactNode;
}

const DraggableRow = <T extends { id: string }>({
  row,
  isDragOverlay = false,
  actionDrawer,
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
    width: isDragOverlay ? "100%" : undefined,
    opacity: isDragging ? (isDragOverlay ? 1 : 0.5) : 1,
  };

  const renderActionDrawer = () => {
    if (typeof actionDrawer === "function") {
      return actionDrawer(row);
    }
    return null;
  };

  return (
    <Table.Row
      ref={setNodeRef}
      style={style}
      className={`transition-all duration-200 ${
        isDragOverlay ? "shadow-lg z-50" : ""
      }`}
    >
      <Table.Cell className="w-[88px] pr-4">
        <div
          {...attributes}
          {...listeners}
          className="flex h-full w-full cursor-move items-center justify-center"
        >
          <DotsSix />
        </div>
      </Table.Cell>
      {row.getVisibleCells().map((cell) => (
        <Table.Cell
          key={cell.id}
          className="!w-auto overflow-hidden"
          style={{
            minWidth: isDragOverlay ? cell.column.getSize() : undefined,
          }}
        >
          <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        </Table.Cell>
      ))}
      <Table.Cell className="w-[88px] pl-4">{renderActionDrawer()}</Table.Cell>
    </Table.Row>
  );
};

export default DraggableRow;
