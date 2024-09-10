import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { redirect } from "react-router-dom";
import { Container, DropdownMenu, Button } from "@medusajs/ui";

const queryClient = new QueryClient();

const PovertyLayout = ({ children }) => {
  function handleNavigation() {
    return new Response("", {
      status: 302,
      headers: {
        Location: "/admin/poverty/navigation",
      },
    });
  }

  return (
    <>
      <Container className="w-full">
        <Button variant="transparent" onClick={handleNavigation}>
          Navigation
        </Button>
        <Button variant="transparent">Something</Button>
        <Button variant="transparent">Else</Button>
      </Container>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
};

export default PovertyLayout;
