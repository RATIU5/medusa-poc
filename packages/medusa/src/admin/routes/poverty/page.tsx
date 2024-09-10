import { useEffect, useRef, useState } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import { Container, DropdownMenu, IconButton } from "@medusajs/ui";
import { EllipsisHorizontal, Trash, PencilSquare } from "@medusajs/icons";
import NavTable from "../../widgets/poverty/navTable";
import HeaderNavDrawer from "../../widgets/poverty/AddHeaderNavDrawer";
import FooterNavDrawer from "../../widgets/poverty/AddFooterNavDrawer";
import PovertyLayout from "../../layouts/povertyLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "@medusajs/ui";
import ky from "ky";
import type { Row } from "@tanstack/react-table";
import type {
  FormattedPovertyNavigationItems,
  GetResponsePovertyNavigation,
} from "../../../utils/types";
import NavEditDrawer from "../../widgets/poverty/navEditDrawer";

function withProps<P = unknown>(
  Component: React.ComponentType<P>,
  props: P
): React.ComponentType<P> {
  return () => <Component {...props} />;
}

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
