import { DropdownMenu, IconButton, usePrompt, toast } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";

const MediaCardDropdown = ({ mediaId }: { mediaId: string }) => {
  const dialog = usePrompt();

  async function deleteMedia(mediaId: string) {
    try {
      const response = await fetch(`/admin/poverty/media/${mediaId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      if (response.status === 200) {
        toast.success("Image deleted successfully");
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      toast.error("Failed to delete image");
    }
  }

  async function handleDeletePrompt() {
    const confirmed = await dialog({
      title: "Are you sure you want to delete this image?",
      description: "This action cannot be undone.",
    });

    if (confirmed) {
      deleteMedia(mediaId);
    }
  }

  return (
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
          <DropdownMenu.Item className="gap-x-2">
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
  );
};

const MediaCard = ({
  url,
  skeleton,
  mediaId,
}: {
  url: string;
  skeleton?: boolean;
  mediaId: string;
}) => {
  if (skeleton) {
    return (
      <div className="flex justify-center items-center aspect-square w-full h-auto max-w-md max-h-md overflow-hidden bg-ui-bg-subtle min-w-[2rem] rounded-md relative shadow-sm">
        <div className="animate-pulse bg-ui-bg-subtle w-full h-auto" />
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center aspect-square w-full h-auto max-w-md max-h-md overflow-hidden bg-ui-bg-subtle min-w-[2rem] rounded-md relative shadow-sm">
      <MediaCardDropdown mediaId={mediaId} />
      <img src={url} alt="media" className="w-full h-auto object-cover" />
    </div>
  );
};

export default MediaCard;
