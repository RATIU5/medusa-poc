import { defineRouteConfig } from "@medusajs/admin-shared";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import { Container, Button } from "@medusajs/ui";

const CustomPage = () => {
  const clickHandler = async () => {
    const res = await fetch("/admin/poverty");
    const json = await res.json();
    console.log(json);
  };
  return (
    <Container>
      <Button onClick={clickHandler} variant="secondary">
        Click me
      </Button>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Poverty CMS",

  icon: ChatBubbleLeftRight,
});

export default CustomPage;
