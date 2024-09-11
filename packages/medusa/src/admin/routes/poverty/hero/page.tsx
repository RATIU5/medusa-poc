import PovertyLayout from '../../../layouts/povertyLayout';
import { Container } from '@medusajs/ui';

const HomePage = () => {
  return (
    <Container className="p-0 mb-1">
      <div className="w-full">
        <p>uwu John, Welcome to Povewty</p>
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
