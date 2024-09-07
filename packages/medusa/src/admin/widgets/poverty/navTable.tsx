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

  return (
    <div className="pb-4">
      <div className="flex justify-between px-6 py-4">
        <Heading level="h1">{title}</Heading>
        <DrawerEl />
      </div>
      <DraggableTable
        isLoading={isFetching || isPending}
        error={error}
        data={hData}
        columns={columns}
        setData={hSetData}
      />
    </div>
  );
};

export default NavTable;
