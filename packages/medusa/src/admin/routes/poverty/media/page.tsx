import { Container, Heading, toast } from "@medusajs/ui";
import { useQuery, useMutation } from "@tanstack/react-query";
import PovertyLayout from "../../../layouts/povertyLayout";
import AddMediaDrawer from "../../../widgets/poverty/AddMediaDrawer";
import type { GetResponseMedia } from "../../../../utils/types";
import MediaGrid from "../../../widgets/poverty/media/MediaGrid";
import ky from "ky";
import { useEffect, useState } from "react";

const MediaPage = () => {
  const [media, setMedia] = useState<GetResponseMedia["data"]>([]);
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["getAllMedia"],
    queryFn: async () => {
      const res = await fetch("/admin/poverty/media");
      const json = (await res.json()) as GetResponseMedia;
      return json?.data ?? ([] as GetResponseMedia["data"]);
    },
    initialData: () => [] as GetResponseMedia["data"],
  });
  const deleteMutation = useMutation({
    mutationFn: async (mediaId: string) => {
      const result = await ky
        .delete(`/admin/poverty/media/${mediaId}`)
        .json<{ error: string } | { id: string }>();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result.id;
    },
  });

  useEffect(() => {
    if (data) {
      setMedia(data);
    }
  }, [data]);

  async function removeItem(id: string) {
    const updatedItems = media.filter((item) => item.id !== id);
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setMedia(updatedItems);
        toast.success("Image deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete image");
      },
    });
  }

  async function addItem(item: GetResponseMedia["data"][number]) {
    setMedia((prev) => [...prev, item]);
  }

  return (
    <Container className="px-0">
      <div className="w-full flex justify-between items-center px-6 pb-4 border-b">
        <Heading level="h1">Media</Heading>
        <AddMediaDrawer addItem={addItem} />
      </div>
      <MediaGrid
        removeItem={removeItem}
        isLoading={isPending || isFetching}
        error={error}
        data={media}
      />
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
