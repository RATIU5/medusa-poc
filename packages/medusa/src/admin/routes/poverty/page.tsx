import { useEffect, useRef, useState } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import { Container, DropdownMenu, IconButton } from "@medusajs/ui";
import { EllipsisHorizontal, Trash, PencilSquare } from "@medusajs/icons";
import NavTable from "../../widgets/poverty/navTable";
import HeaderNavDrawer from "../../widgets/poverty/AddHeaderNavDrawer";
import FooterNavDrawer from "../../widgets/poverty/AddFooterNavDrawer";
import PovertyLayout from "../../layouts/povertyLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "@medusajs/ui";
import ky from "ky";
import type { Row } from "@tanstack/react-table";
import type {
  FormattedPovertyNavigationItems,
  GetResponsePovertyNavigation,
} from "../../../utils/types";
import NavEditDrawer from "../../widgets/poverty/navEditDrawer";

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
    queryKey: ["hNavData"],
    queryFn: async () => {
      const res = await fetch("/admin/poverty/navigation/header");
      const json = (await res.json()) as GetResponsePovertyNavigation;
      return json?.data ?? ([] as GetResponsePovertyNavigation["data"]);
    },
    initialData: () => [] as GetResponsePovertyNavigation["data"],
  });
  const {
    isPending: fIsPending,
    error: fError,
    data: fFetchData,
    isFetching: fIsFetching,
  } = useQuery({
    queryKey: ["fNavData"],
    queryFn: async () => {
      const res = await fetch("/admin/poverty/navigation/footer");
      const json = (await res.json()) as GetResponsePovertyNavigation;
      return json?.data ?? ([] as GetResponsePovertyNavigation["data"]);
    },
    initialData: () => [] as GetResponsePovertyNavigation["data"],
  });
  const hMutation = useMutation({
    mutationFn: (newData: FormattedPovertyNavigationItems[number]) => {
      return ky
        .put("/admin/poverty/navigation/header", {
          json: newData,
        })
        .json();
    },
    onError: () => {
      toast.error("Failed to update navigation item positions");
    },
  });
  const fMutation = useMutation({
    mutationFn: (newData: FormattedPovertyNavigationItems[number]) => {
      return ky
        .put("/admin/poverty/navigation/footer", {
          json: newData,
        })
        .json();
    },
    onError: () => {
      toast.error("Failed to update navigation item positions");
    },
  });
  const [hData, hSetData] = useState<FormattedPovertyNavigationItems>([]);
  const [fData, fSetData] = useState<FormattedPovertyNavigationItems>([]);

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

  useEffect(() => {
    fSetData(
      fFetchData
        .map((d) => ({
          id: d.id,
          slug: d.content.slug,
          name: d.content.name,
          position: d.metadata.position,
        }))
        .sort((a, b) => a.position - b.position)
    );
  }, [fFetchData]);

  function hUpdateItems(
    fn: (
      data: FormattedPovertyNavigationItems
    ) => FormattedPovertyNavigationItems
  ) {
    const newData = fn(hData);
    const updatedData = newData.map((item, index) => {
      return { ...item, position: index + 1 };
    });
    for (const item of updatedData) {
      hMutation.mutate(item);
    }
    hSetData(updatedData);
  }

  function fUpdateItems(
    fn: (
      data: FormattedPovertyNavigationItems
    ) => FormattedPovertyNavigationItems
  ) {
    const newData = fn(hData);
    const updatedData = newData.map((item, index) => {
      return { ...item, position: index + 1 };
    });
    for (const item of updatedData) {
      fMutation.mutate(item);
    }
    fSetData(updatedData);
  }

  const HeaderActionMenu = (
    data: Row<FormattedPovertyNavigationItems[number]>
  ) => {
    const triggerRef = useRef<HTMLButtonElement>(null);

    async function handleDelete() {
      const newData = hData.filter((d) => d.id !== data.original.id);
      hUpdateItems(() => newData);
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

    function openEditDrawer() {
      triggerRef.current?.click();
    }

    return (
      <>
        <NavEditDrawer
          triggerRef={triggerRef}
          drawerTitle="Update Link"
          drawerDescription="Update the link name or slug"
          item={data.original}
          updateExistingItem={(newItem) => {
            hUpdateItems((prev) =>
              prev.map((item) => (item.id === newItem.id ? newItem : item))
            );
          }}
        />
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton variant="transparent">
              <EllipsisHorizontal />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item className="gap-x-2" onClick={openEditDrawer}>
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
      </>
    );
  };

  const FooterActionMenu = (
    data: Row<FormattedPovertyNavigationItems[number]>
  ) => {
    const triggerRef = useRef<HTMLButtonElement>(null);

    async function handleDelete() {
      const newData = fData.filter((d) => d.id !== data.original.id);
      fUpdateItems(() => newData);
      const result = (await ky
        .delete("/admin/poverty/navigation/footer", {
          json: { id: data.original.id },
        })
        .json()) as { data: string };
      if (result.data !== "success") {
        toast.error("Failed to delete item");
      } else {
        toast.success("Successfully deleted item");
      }
    }

    function openEditDrawer() {
      triggerRef.current?.click();
    }

    return (
      <>
        <NavEditDrawer
          triggerRef={triggerRef}
          drawerTitle="Update Link"
          drawerDescription="Update the link name or slug"
          item={data.original}
          updateExistingItem={(newItem) => {
            fUpdateItems((prev) =>
              prev.map((item) => (item.id === newItem.id ? newItem : item))
            );
          }}
        />
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton variant="transparent">
              <EllipsisHorizontal />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item className="gap-x-2" onClick={openEditDrawer}>
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
      </>
    );
  };

  return (
    <>
      <Container className="p-0 mb-1">
        <div className="w-full">
          <NavTable
            title="Header Links"
            isPending={hIsPending}
            isFetching={hIsFetching}
            error={hError}
            data={hData}
            setData={hUpdateItems}
            actionDrawer={HeaderActionMenu}
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
      <Container className="p-0">
        <div className="w-full">
          <NavTable
            title="Footer Links"
            isPending={fIsPending}
            isFetching={fIsFetching}
            error={fError}
            data={fData}
            setData={fUpdateItems}
            actionDrawer={FooterActionMenu}
            DrawerEl={withProps(FooterNavDrawer, {
              setNewItem: (item: FormattedPovertyNavigationItems[number]) => {
                fSetData((prev) => [...prev, item]);
              },
              drawerTitle: "Add New Footer Link",
              drawerDescription:
                "Add a new link to the footer navigation of the store.",
            })}
          />
        </div>
      </Container>
    </>
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
