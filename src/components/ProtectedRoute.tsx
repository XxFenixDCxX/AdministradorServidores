import { Navigate, Outlet } from "react-router-dom";
import { usePcStatus } from "../hooks/usePCStatus";

type Props = {
  pingUrl: string;
};

export default function ProtectedRoute({ pingUrl }: Props) {
  const online = usePcStatus(pingUrl);

  if (online === null) {
    return <p>Comprobando estado del PC...</p>;
  }

  if (!online) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
