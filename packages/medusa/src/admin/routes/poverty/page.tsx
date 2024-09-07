import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import NavTable from "../../widgets/poverty/navTable";
import HeaderNavDrawer from "../../widgets/poverty/navAddDrawer";
import PovertyLayout from "../../layouts/povertyLayout";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export type NewNavItemResponse = {
  data:
    | {
        id: string;
        title: string;
        metadata: {
          position: number;
          type: "header-link" | "footer-link";
        };
        content: {
          name: string;
          slug: string;
        };
        parent_id: string;
        created_at: string;
        updated_at: string;
      }[]
    | null;
};

function withProps<P = unknown>(
  Component: React.ComponentType<P>,
  props: P
): React.ComponentType<P> {
  return () => <Component {...props} />;
}

const HeaderNavPage = () => {
  const {
    isPending: hIsPending,
    error: hError,
    data: hData,
    isFetching: hIsFetching,
  } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      const res = await fetch("/admin/poverty/navigation/header");
      const json = (await res.json()) as NewNavItemResponse;
      return json?.data ?? [];
    },
    initialData: () => [],
  });

  return (
    <Container className="p-0">
      <div className="w-full">
        <NavTable
          title="Header Links"
          isPending={hIsPending}
          isFetching={hIsFetching}
          error={hError}
          items={hData}
          DrawerEl={withProps(HeaderNavDrawer, {
            drawerTitle: "Add New Header Link",
            drawerDescription:
              "Add a new link to the header navigation of the store.",
          })}
        />
        {/* <NavTable
            title="Footer Links"
            items={footerItems}
            DrawerEl={withProps(HeaderNavDrawer, {
              drawerTitle: "Add New Footer Link",
              drawerDescription:
                "Add a new link to the footer navigation of the store.",
            })}
          /> */}
      </div>
    </Container>
  );
};

const PageWrapper = () => {
  return (
    <PovertyLayout>
      <HeaderNavPage />
    </PovertyLayout>
  );
};

export const config = defineRouteConfig({
  label: "Poverty CMS",
  icon: ChatBubbleLeftRight,
});

export default PageWrapper;
