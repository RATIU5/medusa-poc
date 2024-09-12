import {
  type ChangeEventHandler,
  type MouseEventHandler,
  type ChangeEvent,
  type DragEvent,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  Input,
  Text,
  Button,
  IconButton,
  Drawer,
  Label,
  toast,
} from "@medusajs/ui";
import { ArrowUpTray } from "@medusajs/icons";
import SelectMediaCard from "./media/SelectMediaCard";

type MediaStruct = {
  url: string;
  alt: string;
};

const AddMediaDrawer = () => {
  const uploadRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [toUploadMedia, setToUploadMedia] = useState<MediaStruct[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleUploadClick = () => {
    uploadRef.current?.click();
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    handleFiles(e.target.files);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const mediaArray: MediaStruct[] = [];
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        mediaArray.push({ url: URL.createObjectURL(file), alt: "" });
      }
    }
    setToUploadMedia((prev) => [...prev, ...mediaArray]);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleDeleteItem = (url: string) => {
    return () => {
      setToUploadMedia((prev) => prev.filter((m) => m.url !== url));
    };
  };

  const handleTextChange = (
    url: string,
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    return () => {
      setToUploadMedia((prev) =>
        prev.map((m) => {
          if (m.url === url) {
            return { ...m, alt: e.target.value };
          }
          return m;
        })
      );
    };
  };

  const handleFormSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    for (const media of toUploadMedia) {
      if (!media.alt) {
        toast.error("Alt text is required for all images");
        return;
      }
    }
  };

  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button variant="transparent">
          <ArrowUpTray />
          <span>Upload</span>
        </Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Upload Media</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4">
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center gap-x-1">
                <label
                  className="font-sans txt-compact-small font-medium"
                  id=":rao:-form-item-label"
                  htmlFor=":rao:-form-item"
                >
                  Media
                </label>
                <p className="font-normal font-sans txt-compact-small text-ui-fg-muted">
                  (Optional)
                </p>
              </div>
              <span
                className="txt-small text-ui-fg-subtle"
                id=":rao:-form-item-description"
              >
                Add media to the storefront.
              </span>
            </div>
            <div
              ref={dropZoneRef}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`bg-ui-bg-component border-ui-border-strong transition-fg group flex w-full flex-col items-center gap-y-2 rounded-lg border border-dashed p-8 hover:border-ui-border-interactive focus:border-ui-border-interactive focus:shadow-borders-focus outline-none focus:border-solid ${
                isDragging ? "border-ui-border-interactive bg-ui-bg-base" : ""
              }`}
            >
              <button
                type="button"
                onClick={handleUploadClick}
                className="bg-transparent border-none cursor-pointer"
              >
                <div className="text-ui-fg-subtle group-disabled:text-ui-fg-disabled flex items-center gap-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    fill="none"
                  >
                    <title>Upload media</title>
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M13.056 9.944v1.334c0 .982-.796 1.778-1.778 1.778H3.722a1.777 1.777 0 0 1-1.778-1.778V9.944M4.389 5.5 7.5 8.611 10.611 5.5M7.5 8.611V1.944"
                    />
                  </svg>
                  <p className="font-normal font-sans txt-medium">
                    Upload images
                  </p>
                </div>
                <p className="font-normal font-sans txt-compact-small text-ui-fg-muted group-disabled:text-ui-fg-disabled">
                  {isDragging
                    ? "Drop your images here"
                    : "Drag and drop images here or click to upload."}
                </p>
              </button>
              <input
                ref={uploadRef}
                onChange={handleFileChange}
                hidden={true}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/svg+xml"
                multiple={true}
              />
            </div>
          </div>
          <div className="p-1">
            <div className="flex flex-row flex-wrap justify-start items-start gap-3 py-3">
              {toUploadMedia.length > 0 &&
                toUploadMedia.map((m, i) => (
                  <SelectMediaCard
                    key={`image:${m.url + i}`}
                    url={m.url}
                    alt={m.alt}
                    handleDeleteItem={handleDeleteItem}
                    handleTextChange={handleTextChange}
                  />
                ))}
            </div>
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button onClick={handleFormSubmit}>Upload</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

export default AddMediaDrawer;
