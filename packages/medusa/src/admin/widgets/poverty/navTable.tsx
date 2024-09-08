import type { Dispatch, SetStateAction } from "react";
import { Heading } from "@medusajs/ui";
import DraggableTable from "../draggable-table/DraggableTable";
import type { ColumnDef, Row } from "@tanstack/react-table";
import type { FormattedPovertyNavigationItems } from "../../../utils/types";

const columns: ColumnDef<FormattedPovertyNavigationItems[number]>[] = [
  { header: "Name", accessorKey: "name" },
  { header: "Slug", accessorKey: "slug" },
];

const NavTable = ({
  title,
  data,
  DrawerEl,
  actionDrawer,
  isPending,
  isFetching,
  setData,
  error,
}: {
  title: string;
  data: FormattedPovertyNavigationItems;
  DrawerEl: React.ComponentType;
  actionDrawer: (
    data: Row<FormattedPovertyNavigationItems[number]>
  ) => React.ReactNode;
  isPending: boolean;
  isFetching: boolean;
  setData: (
    fn: (
      data: FormattedPovertyNavigationItems
    ) => FormattedPovertyNavigationItems
  ) => void;
  error: Error;
}) => {
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
