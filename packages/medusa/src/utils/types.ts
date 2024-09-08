export type GetResponsePovertyNavigation = {
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

export type PostResponsePovertyNavigation = {
  data: GetResponsePovertyNavigation["data"][number];
};

export type FormattedPovertyNavigationItems = Array<
  GetResponsePovertyNavigation["data"][number]["content"] & {
    id: string;
    position: number;
  }
>;
