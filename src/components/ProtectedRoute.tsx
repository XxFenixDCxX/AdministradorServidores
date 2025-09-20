import { Navigate, Outlet } from "react-router-dom";
import { usePcStatus } from "../hooks/usePcStatus";
import PcStatusLoader from "./PcStatusLoader/PcStatusLoader";

type Props = {
  pingUrl: string;
};

export default function ProtectedRoute({ pingUrl }: Props) {
  const online = usePcStatus(pingUrl);

  if (online === null) {
    return (
      <PcStatusLoader
        message="Comprobando estado del servidor..."
        subtitle="Por favor, espere."
      />
    );
  }

  if (!online) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
