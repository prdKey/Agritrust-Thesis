import { useParams } from 'react-router-dom';
import Placeholder from '../Placeholder';

export default function ProductDetail() {
  const { id } = useParams();
  return <Placeholder />;
}
