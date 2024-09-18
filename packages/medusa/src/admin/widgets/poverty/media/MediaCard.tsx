import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  IconButton,
  usePrompt,
  Drawer,
  Label,
  Input,
  Button,
} from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import { useEffect, useRef, useState } from "react";
import ky from "ky";
import type { GetResponsePovertyMediaItem } from "../../../../utils/types";

const MediaCardDropdown = ({
  mediaId,
  removeItem,
  defaultAlt,
}: {
  mediaId: string;
  removeItem: (id: string) => Promise<void>;
  defaultAlt: string;
}) => {
  const dialog = usePrompt();
  const [altValue, setAltValue] = useState<string>(defaultAlt);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);

  function handleAltReset() {
    const oldVal = defaultAlt;
    setAltValue(oldVal ?? "");
  }

  function handleEditClick() {
    drawerTriggerRef.current?.click();
  }

  function handleAltChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAltValue(e.target.value);
  }

  async function handleDeletePrompt() {
    const confirmed = await dialog({
      title: "Are you sure you want to delete this image?",
      description: "This action cannot be undone.",
    });

    if (confirmed) {
      await removeItem(mediaId);
    }
  }

  return (
    <>
      <Drawer>
        <Drawer.Trigger className="hidden" ref={drawerTriggerRef} />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edit Image Alt</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-1">
                  <Label
                    className="font-sans txt-compact-small font-medium"
                    htmlFor="editMediaAltInput"
                  >
                    Media
                  </Label>
                  <p className="font-normal font-sans txt-compact-small text-ui-fg-muted">
                    (Optional)
                  </p>
                </div>
                <span className="txt-small text-ui-fg-subtle">
                  Add media to the storefront.
                </span>
              </div>
              <Input
                type="text"
                id="editMediaAltInput"
                value={altValue}
                onChange={handleAltChange}
              />
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close asChild>
              <Button variant="secondary" onClick={handleAltReset}>
                Cancel
              </Button>
            </Drawer.Close>
            <Button>Update</Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
      <div className="absolute right-2 top-2">
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <div className="bg-ui-bg-component rounded-md">
              <IconButton variant="transparent">
                <EllipsisHorizontal />
              </IconButton>
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item className="gap-x-2" onClick={handleEditClick}>
              <PencilSquare className="text-ui-fg-subtle" />
              Edit Alt
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item className="gap-x-2" onClick={handleDeletePrompt}>
              <Trash className="text-ui-fg-subtle" />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    </>
  );
};

const MediaCard = ({
  url,
  mediaId,
  removeItem,
  alt,
}: {
  url: string;
  mediaId: string;
  removeItem: (id: string) => Promise<void>;
  alt: string;
}) => {
  return (
    <div className="flex justify-center items-center aspect-square w-full h-auto max-w-md max-h-md overflow-hidden bg-ui-bg-subtle min-w-[2rem] rounded-md relative shadow-sm">
      <MediaCardDropdown
        mediaId={mediaId}
        removeItem={removeItem}
        defaultAlt={alt}
      />
      <img src={url} alt={alt} className="w-full h-auto object-cover" />
    </div>
  );
};

export default MediaCard;
