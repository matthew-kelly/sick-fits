import { useRouter } from 'next/router';
import styled from 'styled-components';
import Pagination from '../../components/Pagination';
import Products from '../../components/Products';

const FlexColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function ProductPage() {
  const { query } = useRouter();
  const page = parseInt(query.page);
  return (
    <FlexColumnDiv>
      <Pagination page={page || 1} />
      <Products page={page || 1} />
      <Pagination page={page || 1} />
    </FlexColumnDiv>
  );
}
