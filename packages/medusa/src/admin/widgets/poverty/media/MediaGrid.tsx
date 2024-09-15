import type { GetResponseMedia } from "../../../../utils/types";
import MediaCard from "./MediaCard";
import type { UseMutationResult } from "@tanstack/react-query";

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
        <MediaCard url="" mediaId="" skeleton={true} />
        <MediaCard url="" mediaId="" skeleton={true} />
        <MediaCard url="" mediaId="" skeleton={true} />
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
