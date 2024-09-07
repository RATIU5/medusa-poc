import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import { Container, DropdownMenu, IconButton } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Plus, Trash } from "@medusajs/icons";
import NavTable from "../../widgets/poverty/navTable";
import HeaderNavDrawer from "../../widgets/poverty/navAddDrawer";
import PovertyLayout from "../../layouts/povertyLayout";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import DraggableTable from "../../widgets/draggable-table/DraggableTable";
import { Row } from "@tanstack/react-table";

// export interface Person {
//   id: string;
//   name: string;
//   age: number;
//   city: string;
// }

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
      return json?.data ?? ([] as NewNavItemResponse["data"]);
    },
    initialData: () => [] as NewNavItemResponse["data"],
  });

  const ActionDrawer = (data: Row<NewNavItemResponse["data"][number]>) => {
    return (
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton variant="transparent">
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item className="gap-x-2">
            <PencilSquare className="text-ui-fg-subtle" />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item className="gap-x-2">
            <Trash className="text-ui-fg-subtle" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  };

  return (
    <Container className="p-0">
      <div className="w-full">
        <NavTable
          title="Footer Links"
          isPending={hIsPending}
          isFetching={hIsFetching}
          error={hError}
          data={hData}
          actionDrawer={ActionDrawer}
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
