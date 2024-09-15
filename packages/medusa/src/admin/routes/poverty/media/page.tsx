import { Container, Heading } from "@medusajs/ui";
import { useQuery, useMutation } from "@tanstack/react-query";
import PovertyLayout from "../../../layouts/povertyLayout";
import AddMediaDrawer from "../../../widgets/poverty/AddMediaDrawer";
import type { GetResponseMedia } from "../../../../utils/types";
import MediaCard from "../../../widgets/poverty/media/MediaCard";

const MediaPage = () => {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["hNavData"],
    queryFn: async () => {
      const res = await fetch("/admin/poverty/media");
      const json = (await res.json()) as GetResponseMedia;
      return json?.data ?? ([] as GetResponseMedia["data"]);
    },
    initialData: () => [] as GetResponseMedia["data"],
  });

  return (
    <Container className="px-0">
      <div className="w-full flex justify-between items-center px-6 pb-4 border-b">
        <Heading level="h1">Media</Heading>
        <AddMediaDrawer />
      </div>
      <div>
        {isPending || isFetching ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error</div>
        ) : (
          data.map((item, i) => (
            <MediaCard key={`${item.path} + ${i}`} url={item.path} />
          ))
        )}
      </div>
    </Container>
  );
};

const PageWrapper = () => {
  return (
    <PovertyLayout>
      <MediaPage />
    </PovertyLayout>
  );
};

export default PageWrapper;
