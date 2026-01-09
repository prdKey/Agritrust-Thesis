import { useParams } from 'react-router-dom';
import Placeholder from '../Placeholder';

export default function OrderDetail() {
  const { id } = useParams();
  return <Placeholder />;
}
