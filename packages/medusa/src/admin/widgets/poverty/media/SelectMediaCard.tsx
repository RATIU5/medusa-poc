import { Textarea, Text, IconButton, Label } from "@medusajs/ui";
import { XMarkMini } from "@medusajs/icons";
import type { ChangeEvent } from "react";

const SelectMediaCard = ({
  url,
  alt,
  handleDeleteItem,
  handleTextChange,
}: {
  url: string;
  alt?: string;
  handleDeleteItem: (url: string) => () => void;
  handleTextChange: (
    url: string,
    e: ChangeEvent<HTMLTextAreaElement>
  ) => (fn: ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-4 w-full items-start">
        <img
          src={url}
          alt={alt ?? "no alt provided"}
          className="w-40 h-40 aspect-square object-cover rounded-lg"
        />
        <div className="flex flex-col gap-3 h-40">
          <div className="flex flex-col">
            <Label htmlFor={`${url}-id`}>Alt Text *</Label>
            <Text className="text-sm text-ui-fg-muted">
              Describe what the image is portraying.
            </Text>
          </div>
          <Textarea
            value={alt}
            id={`${url}-id`}
            placeholder="A closeup of an orange cat"
            className="h-full flex-1 resize-none"
            onChange={(e) => handleTextChange(url, e)}
          />
        </div>
      </div>
      <IconButton variant="transparent" onClick={handleDeleteItem(url)}>
        <XMarkMini />
      </IconButton>
    </div>
  );
};

export default SelectMediaCard;
