import { useState } from "react";
import { Input, Text, Button, IconButton, Drawer, Label } from "@medusajs/ui";
import { PlusMini } from "@medusajs/icons";

const HeaderNavDrawer = ({
  drawerTitle,
  drawerDescription,
}: {
  drawerTitle: string;
  drawerDescription: string;
}) => {
  const [pageName, setPageName] = useState<string>();
  const [pageSlug, setPageSlug] = useState<string>();

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPageName(e.target.value);
  }

  function handleSlugNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPageSlug(e.target.value);
  }

  function handleFormSubmit() {
    // handleNewHeaderLinkSubmit();
  }

  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <IconButton variant="transparent">
          <PlusMini />
        </IconButton>
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

export default HeaderNavDrawer;
