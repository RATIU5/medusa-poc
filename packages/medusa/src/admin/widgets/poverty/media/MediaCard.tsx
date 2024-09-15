import { Textarea, Text, DropdownMenu, IconButton, Label } from "@medusajs/ui";
import {
  EllipsisHorizontal,
  PencilSquare,
  Plus,
  Trash,
  XMarkMini,
} from "@medusajs/icons";

const MediaCardDropdown = () => {
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
          Edit Alt
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

const MediaCard = ({ url }: { url: string }) => {
  return (
    <div className="aspect-square w-full h-auto max-w-md max-h-md overflow-hidden bg-ui-bg-subtle min-w-[2rem]">
      <DropdownMenu />
      <img src={url} alt="media" className="w-full h-full object-cover" />
    </div>
  );
};

export default MediaCard;
