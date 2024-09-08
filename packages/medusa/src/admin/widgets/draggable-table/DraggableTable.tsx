import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";
import { Table } from "@medusajs/ui";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import DraggableRow from "./DraggableRow";

interface DraggableTableProps<T extends { id: string }> {
  columns: ColumnDef<T>[];
  data: T[];
  setData: (fn: (data: T[]) => T[]) => void;
  isLoading: boolean;
  error: Error;
  actionDrawer: (data: Row<T>) => React.ReactNode;
}

function DraggableTable<T extends { id: string }>({
  isLoading,
  error,
  columns,
  data,
  setData,
  actionDrawer,
}: DraggableTableProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      size: 150,
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setData((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
    >
      <Table className="w-full table-fixed">
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              <Table.HeaderCell className="w-[88px]" />
              {headerGroup.headers.map((header) => (
                <Table.HeaderCell
                  key={header.id}
                  className="!w-auto overflow-hidden"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Table.HeaderCell>
              ))}
              <Table.HeaderCell className="w-[88px]" />
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                <Table.Cell className="w-[88px]" />
                {headerGroup.headers.map((header) => (
                  <Table.Cell
                    key={header.id}
                    className="!w-auto overflow-hidden"
                    style={{ width: header.getSize() }}
                  >
                    <div className="w-full p-2 bg-white/5 rounded-full" />
                  </Table.Cell>
                ))}
                <Table.HeaderCell className="w-[88px]" />
              </Table.Row>
            ))
          ) : (
            <SortableContext
              items={data.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <DraggableRow
                  key={row.original.id}
                  row={row}
                  actionDrawer={actionDrawer}
                />
              ))}
            </SortableContext>
          )}
        </Table.Body>
      </Table>
      <DragOverlay>
        {activeId ? (
          <Table className="w-full table-fixed">
            <Table.Body>
              <DraggableRow
                row={table
                  .getRowModel()
                  .rows.find((row) => row.original.id === activeId)}
                isDragOverlay
              />
            </Table.Body>
          </Table>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default DraggableTable;
