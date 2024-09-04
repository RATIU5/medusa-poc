import { defineRouteConfig } from "@medusajs/admin-shared";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import NavTable from "../../widgets/poverty/navTable";
import HeaderNavDrawer from "../../widgets/poverty/navAddDrawer";

export type NewNavItemResponse = {
  data: {
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
  } | null;
};

function withProps<P>(
  Component: React.ComponentType<P>,
  props: P
): React.ComponentType<unknown> {
  return () => <Component {...props} />;
}

const CustomPage = () => {
  return (
    <Container className="p-0">
      <div className="w-full">
        <NavTable
          title="Header Navigation Links"
          items={[]}
          DrawerEl={withProps(HeaderNavDrawer, {
            drawerTitle: "Add New Header Link",
            drawerDescription:
              "Add a new link to the header navigation of the store.",
          })}
        />
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Poverty CMS",

  icon: ChatBubbleLeftRight,
});

export default CustomPage;
