import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Container, Button } from '@medusajs/ui';

const queryClient = new QueryClient();

const PovertyLayout = ({ children }) => {
  return (
    <>
      <Container className="w-full">
        <Link to="/poverty/navigation">
          <Button variant="transparent">Navigation</Button>
        </Link>
        <Link to="/poverty/hero">
          <Button variant="transparent">Home Hero</Button>
        </Link>
        <Button variant="transparent">Else</Button>
      </Container>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
};

export default PovertyLayout;
