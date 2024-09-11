import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import PovertyLayout from "../../layouts/povertyLayout";

const HeaderNavPage = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <p className="absolute top-1/2 -translate-x-1/2">Welcome to Poverty</p>
    </div>
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
