import { Heading } from "@medusajs/ui";
import type { NewNavItemResponse } from "src/admin/routes/poverty/page";
import DraggableTable from "../draggable-table/DraggableTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

interface Person {
  id: string;
  name: string;
  age: number;
  city: string;
}

const columns: ColumnDef<Person>[] = [
  { header: "Name", accessorKey: "name" },
  { header: "Age", accessorKey: "age" },
  { header: "City", accessorKey: "city" },
];

const data: Person[] = [
  { id: "1", name: "John Doe", age: 30, city: "New York" },
  { id: "2", name: "Jane Smith", age: 25, city: "London" },
  { id: "3", name: "Bob Johnson", age: 35, city: "Paris" },
];

const NavTable = ({
  title,
  data: defaultData,
  DrawerEl,
  isPending,
  isFetching,
  error,
}: {
  title: string;
  data: Person[];
  DrawerEl: React.ComponentType;
  isPending: boolean;
  isFetching: boolean;
  error: Error;
}) => {
  const [hData, hSetData] = useState<Person[]>(defaultData);

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
      <DraggableTable data={hData} columns={columns} setData={hSetData} />
    </div>
  );
};

export default NavTable;
