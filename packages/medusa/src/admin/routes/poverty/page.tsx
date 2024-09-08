import { useEffect, useState } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import { Container, DropdownMenu, IconButton } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import NavTable from "../../widgets/poverty/navTable";
import HeaderNavDrawer from "../../widgets/poverty/navAddDrawer";
import PovertyLayout from "../../layouts/povertyLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "@medusajs/ui";
import ky from "ky";
import type { Row } from "@tanstack/react-table";
import type {
  FormattedPovertyNavigationItems,
  GetResponsePovertyNavigation,
} from "../../../utils/types";

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
    data: hFetchData,
    isFetching: hIsFetching,
  } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      const res = await fetch("/admin/poverty/navigation/header");
      const json = (await res.json()) as GetResponsePovertyNavigation;
      return json?.data ?? ([] as GetResponsePovertyNavigation["data"]);
    },
    initialData: () => [] as GetResponsePovertyNavigation["data"],
  });
  const mutation = useMutation({
    mutationFn: (newData: FormattedPovertyNavigationItems[number]) => {
      return ky
        .put("/admin/poverty/navigation/header", {
          json: newData,
        })
        .json();
    },
    onSuccess: () => {
      toast.success("Successfully updated navigation item positions");
    },
    onError: () => {
      toast.error("Failed to update navigation item positions");
    },
  });
  const [hData, hSetData] = useState<FormattedPovertyNavigationItems>([]);

  useEffect(() => {
    hSetData(
      hFetchData
        .map((d) => ({
          id: d.id,
          slug: d.content.slug,
          name: d.content.name,
          position: d.metadata.position,
        }))
        .sort((a, b) => a.position - b.position)
    );
  }, [hFetchData]);

  function updateItemPositions(
    fn: (
      data: FormattedPovertyNavigationItems
    ) => FormattedPovertyNavigationItems
  ) {
    const newData = fn(hData);
    const updatedData = newData.map((item, index) => {
      return { ...item, position: index + 1 };
    });
    for (const item of updatedData) {
      mutation.mutate(item);
    }
    hSetData(updatedData);
  }

  const ActionDrawer = (data: Row<FormattedPovertyNavigationItems[number]>) => {
    async function handleDelete() {
      const newData = hData.filter((d) => d.id !== data.original.id);
      updateItemPositions(() => newData);
      const result = (await ky
        .delete("/admin/poverty/navigation/header", {
          json: { id: data.original.id },
        })
        .json()) as { data: string };
      if (result.data !== "success") {
        toast.error("Failed to delete item");
      } else {
        toast.success("Successfully deleted item");
      }
    }

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
          <DropdownMenu.Item className="gap-x-2" onClick={handleDelete}>
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
          title="Header Links"
          isPending={hIsPending}
          isFetching={hIsFetching}
          error={hError}
          data={hData}
          setData={updateItemPositions}
          actionDrawer={ActionDrawer}
          DrawerEl={withProps(HeaderNavDrawer, {
            setNewItem: (item: FormattedPovertyNavigationItems[number]) => {
              hSetData((prev) => [...prev, item]);
            },
            drawerTitle: "Add New Header Link",
            drawerDescription:
              "Add a new link to the header navigation of the store.",
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
