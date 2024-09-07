import React, { useState, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Table } from "@medusajs/ui";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
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
  setData: Dispatch<SetStateAction<T[]>>;
}

function DraggableTable<T extends { id: string }>({
  columns,
  data,
  setData,
}: DraggableTableProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        setData((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over?.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }

      setActiveId(null);
    },
    [setData]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToVerticalAxis]}
    >
      <Table>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              <Table.HeaderCell></Table.HeaderCell>
              {headerGroup.headers.map((header) => (
                <Table.HeaderCell key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Table.HeaderCell>
              ))}
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          <SortableContext
            items={data.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {table.getRowModel().rows.map((row) => (
              <DraggableRow
                key={row.original.id}
                row={row}
                isActive={activeId === row.original.id}
              />
            ))}
          </SortableContext>
        </Table.Body>
      </Table>
      <DragOverlay>
        {activeId ? (
          <Table>
            <Table.Body>
              <DraggableRow
                row={
                  table
                    .getRowModel()
                    .rows.find((row) => row.original.id === activeId)!
                }
                isActive={true}
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
