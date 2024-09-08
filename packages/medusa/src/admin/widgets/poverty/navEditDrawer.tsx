import { useState } from "react";
import { Input, Text, Button, IconButton, Drawer, Label } from "@medusajs/ui";
import { PencilSquare } from "@medusajs/icons";
import { toast } from "@medusajs/ui";
import type {
  FormattedPovertyNavigationItems,
  PostResponsePovertyNavigation,
} from "../../../utils/types";

const NavEditDrawer = ({
  drawerTitle,
  drawerDescription,
  item,
  updateExistingItem,
  triggerRef,
}: {
  drawerTitle: string;
  drawerDescription: string;
  item: FormattedPovertyNavigationItems[number];
  updateExistingItem: (data: FormattedPovertyNavigationItems[number]) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}) => {
  const [pageName, setPageName] = useState<string>(item.name);
  const [pageSlug, setPageSlug] = useState<string>(item.slug);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPageName(e.target.value);
  }

  function handleSlugNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPageSlug(e.target.value);
  }

  async function handleFormSubmit() {
    try {
      const slug = pageSlug?.startsWith("/") ? pageSlug : `/${pageSlug}`;

      const res = await fetch("/admin/poverty/navigation/header", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          name: pageName,
          slug,
          position: 0,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update link");
      }

      const json = (await res.json()) as
        | PostResponsePovertyNavigation
        | { data: string };

      if (!json.data) {
        throw new Error("Failed to update link");
      }

      if (typeof json.data === "string") {
        throw new Error("Failed to update link");
      }

      const newItem = {
        id: json.data.id,
        name: json.data.content.name,
        slug: json.data.content.slug,
        position: json.data.metadata.position,
      };

      toast.success("Successfully updated link");
      updateExistingItem(newItem);
      triggerRef.current?.click();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <IconButton ref={triggerRef} className="hidden" />
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>{drawerTitle}</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4">
          <Text>{drawerDescription}</Text>
          <div className="w-[250px]">
            <Label>Page Name</Label>
            <Input
              placeholder="Mattresses"
              id="pageName"
              value={pageName}
              onChange={handleNameChange}
            />
          </div>
          <div className="w-[250px]">
            <Label>Page Slug</Label>
            <Input
              placeholder="/mattresses"
              id="pageSlug"
              value={pageSlug}
              onChange={handleSlugNameChange}
            />
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button onClick={handleFormSubmit}>Save</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

export default NavEditDrawer;
