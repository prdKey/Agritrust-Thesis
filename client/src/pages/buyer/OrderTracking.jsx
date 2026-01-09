import { useParams } from 'react-router-dom';
import Placeholder from '../Placeholder';

export default function OrderTracking() {
  const { orderId } = useParams();
  return <Placeholder />;
}
