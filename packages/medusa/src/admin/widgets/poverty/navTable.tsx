import { Heading } from "@medusajs/ui";
import DraggableTable from "../draggable-table/DraggableTable";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { NewNavItemResponse } from "src/admin/routes/poverty/page";

const columns: ColumnDef<NewNavItemResponse["data"][number]>[] = [
  { header: "Name", accessorKey: "name" },
  { header: "Slug", accessorKey: "slug" },
];

const NavTable = ({
  title,
  data: defaultData,
  DrawerEl,
  actionDrawer,
  isPending,
  isFetching,
  error,
}: {
  title: string;
  data: NewNavItemResponse["data"];
  DrawerEl: React.ComponentType;
  actionDrawer: (
    data: Row<NewNavItemResponse["data"][number]>
  ) => React.ReactNode;
  isPending: boolean;
  isFetching: boolean;
  error: Error;
}) => {
  const [data, setData] = useState<NewNavItemResponse["data"]>(defaultData);

  return (
    <div className="pb-4">
      <div className="flex justify-between px-6 py-4">
        <Heading level="h1">{title}</Heading>
        <DrawerEl />
      </div>
      <DraggableTable
        isLoading={isFetching || isPending}
        error={error}
        data={data}
        actionDrawer={actionDrawer}
        columns={columns}
        setData={setData}
      />
    </div>
  );
};

export default NavTable;
