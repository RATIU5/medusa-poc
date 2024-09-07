import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import NavTable from "../../widgets/poverty/navTable";
import HeaderNavDrawer from "../../widgets/poverty/navAddDrawer";
import PovertyLayout from "../../layouts/povertyLayout";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import DraggableTable from "../../widgets/draggable-table/DraggableTable";

export type NewNavItemResponse = {
  data:
    | {
        id: string;
        title: string;
        metadata: {
          position: number;
          type: "header-link" | "footer-link";
        };
        content: {
          name: string;
          slug: string;
        };
        parent_id: string;
        created_at: string;
        updated_at: string;
      }[]
    | null;
};

function withProps<P = unknown>(
  Component: React.ComponentType<P>,
  props: P
): React.ComponentType<P> {
  return () => <Component {...props} />;
}

const HeaderNavPage = () => {
  const {
    isPending: hIsPending,
    error: hError,
    data: hData,
    isFetching: hIsFetching,
  } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      const res = await fetch("/admin/poverty/navigation/header");
      const json = (await res.json()) as NewNavItemResponse;
      return [
        { id: "1", name: "John Doe", age: 30, city: "New York" },
        { id: "2", name: "Jane Smith", age: 25, city: "London" },
        { id: "3", name: "Bob Johnson", age: 35, city: "Paris" },
      ];
      return json?.data ?? [];
    },
    initialData: () => [],
  });

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Age", accessorKey: "age" },
    { header: "City", accessorKey: "city" },
  ];

  const data = [
    { id: "1", name: "John Doe", age: 30, city: "New York" },
    { id: "2", name: "Jane Smith", age: 25, city: "London" },
    { id: "3", name: "Bob Johnson", age: 35, city: "Paris" },
    { id: "4", name: "Kevin Bacon", age: 23, city: "Sydney" },
  ];

  return (
    <Container className="p-0">
      <div className="w-full">
        {/* <DraggableTable columns={columns} data={data} /> */}
        <NavTable
          title="Footer Links"
          isPending={hIsPending}
          isFetching={hIsFetching}
          error={hError}
          data={data}
          DrawerEl={withProps(HeaderNavDrawer, {
            drawerTitle: "Add New Footer Link",
            drawerDescription:
              "Add a new link to the footer navigation of the store.",
          })}
        />
      </div>
    </Container>
  );
};

const PageWrapper = () => {
  return (
    <PovertyLayout>
      <HeaderNavPage />
    </PovertyLayout>
  );
};

export const config = defineRouteConfig({
  label: "Poverty CMS",
  icon: ChatBubbleLeftRight,
});

export default PageWrapper;
