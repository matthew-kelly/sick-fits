import { useUser } from './User';

export default function GatedSignInWrapper({ children }) {
  const me = useUser();
  if (!me) return null;
  return children;
}
