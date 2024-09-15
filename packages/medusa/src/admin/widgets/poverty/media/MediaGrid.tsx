import type { GetResponseMedia } from "../../../../utils/types";
import MediaCard from "./MediaCard";

const MediaGrid = ({
  isLoading,
  error,
  data,
  removeItem,
}: {
  isLoading: boolean;
  error: Error;
  data: GetResponseMedia["data"];
  removeItem: (id: string) => Promise<void>;
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] auto-rows-[1fr] gap-4 px-6 pt-4">
        <div className="flex justify-center items-center aspect-square w-full h-auto max-w-md max-h-md overflow-hidden bg-ui-bg-subtle min-w-[2rem] rounded-md relative shadow-sm">
          <div className="animate-pulse bg-ui-bg-subtle w-full h-auto" />
        </div>
        <div className="flex justify-center items-center aspect-square w-full h-auto max-w-md max-h-md overflow-hidden bg-ui-bg-subtle min-w-[2rem] rounded-md relative shadow-sm">
          <div className="animate-pulse bg-ui-bg-subtle w-full h-auto" />
        </div>
        <div className="flex justify-center items-center aspect-square w-full h-auto max-w-md max-h-md overflow-hidden bg-ui-bg-subtle min-w-[2rem] rounded-md relative shadow-sm">
          <div className="animate-pulse bg-ui-bg-subtle w-full h-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] auto-rows-[1fr] gap-4 px-6 pt-4">
      {data.map((item, i) => (
        <MediaCard
          removeItem={removeItem}
          key={`${item.path} + ${i}`}
          url={item.path}
          mediaId={item.id}
        />
      ))}
    </div>
  );
};

export default MediaGrid;
