import ImageList from "../../../widgets/poverty/ImageList";
import PovertyLayout from "../../../layouts/povertyLayout";
import {
  Container,
  Label,
  Input,
  Textarea,
  FocusModal,
  Button,
} from "@medusajs/ui";

const HomePage = () => {
  return (
    <Container className="p-0 mb-1 w-fit min-w-[20rem]">
      <div className="max-w-sm px-6 py-4 flex flex-col gap-4 mx-auto">
        <div className="max-w-xs flex flex-col gap-1">
          <Label htmlFor="title">Hero Title</Label>
          <Input
            type="text"
            id="title"
            placeholder="Save 50% off all products"
          />
        </div>
        <div className="max-w-xs flex flex-col gap-1">
          <Label htmlFor="description">Hero Description</Label>
          <Textarea
            id="description"
            placeholder="Lorem ipsum dolor sit amet."
          />
        </div>
        <div className="max-w-xs flex flex-col gap-1">
          <Label htmlFor="btnText">Button Text</Label>
          <Input type="text" id="btnText" placeholder="Shop Now" />
        </div>
        <div className="max-w-xs flex flex-col gap-1">
          <Label htmlFor="btnLink">Button Link</Label>
          <Input type="text" id="btnLink" placeholder="/mattresses" />
        </div>
        <div className="max-w-xs flex flex-col gap-1">
          <div className="flex justify-between items-center py-1">
            <Label>Hero Image</Label>
            <FocusModal>
              <FocusModal.Trigger asChild>
                <Button variant="secondary">Select Image</Button>
              </FocusModal.Trigger>
              <FocusModal.Content>
                <FocusModal.Header>Select An Image</FocusModal.Header>
                <FocusModal.Body>
                  <ImageList />
                </FocusModal.Body>
              </FocusModal.Content>
            </FocusModal>
          </div>
          <div className="p-2 h-32 border border-solid border-ui-border-base rounded-lg mb-2 text-lg text-ui-fg-subtle flex justify-center items-center select-none">
            No Image
          </div>
        </div>
      </div>
    </Container>
  );
};

const PageWrapper = () => {
  return (
    <PovertyLayout>
      <HomePage />
    </PovertyLayout>
  );
};

export default PageWrapper;
