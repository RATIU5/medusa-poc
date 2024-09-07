import React, { useState, useEffect } from "react";
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
  DragStartEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
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
  const [animationOffsets, setAnimationOffsets] = useState<
    Record<string, number>
  >({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (Object.keys(animationOffsets).length > 0) {
      const timer = setTimeout(() => {
        setAnimationOffsets({});
      }, 300); // Duration of the animation
      return () => clearTimeout(timer);
    }
  }, [animationOffsets]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setData((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        // Calculate offsets for animation
        const newOffsets: Record<string, number> = {};
        const movingDown = newIndex > oldIndex;
        const start = movingDown ? oldIndex : newIndex;
        const end = movingDown ? newIndex : oldIndex;

        for (let i = start; i <= end; i++) {
          if (i === oldIndex) {
            newOffsets[items[i].id] = (newIndex - oldIndex) * 100; // 100 is the assumed height of a row
          } else {
            newOffsets[items[i].id] = movingDown ? -100 : 100;
          }
        }

        setAnimationOffsets(newOffsets);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

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
                animationOffset={animationOffsets[row.original.id] || 0}
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
                row={table.getRowModel().rowsById[activeId]}
                isActive={true}
                animationOffset={0}
              />
            </Table.Body>
          </Table>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default DraggableTable;
