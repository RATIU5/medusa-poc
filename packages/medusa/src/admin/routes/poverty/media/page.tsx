import PovertyLayout from "../../../layouts/povertyLayout";
import { Container, Heading } from "@medusajs/ui";
import AddMediaDrawer from "../../../widgets/poverty/AddMediaDrawer";

const MediaPage = () => {
  return (
    <Container>
      <div>
        <div className="w-full flex justify-between items-center">
          <Heading level="h1">Media</Heading>
          <AddMediaDrawer />
        </div>
        <div></div>
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
