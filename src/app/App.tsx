import {
  AdminAddRoomFrom,
  AdminAddUserForm,
  AdminLayout,
  AdminReservationList,
  AdminRoomsList,
  AdminUsersList,
} from "@/features/admin";
import { Accessor, Authenticator } from "@/features/auth";
import {
  MeetingRoom,
  MeetingRoomsLayout,
  MeetingRoomsList,
} from "@/features/meeting_rooms";
import "antd/dist/reset.css";
import { Navigate, Route, Routes } from "react-router";
import { SWRConfig, SWRConfiguration } from "swr";
import { AppLayout } from "./layout";
import { useApi } from "./shared/api/useApi";

interface ProviderProps {
  children?: React.ReactNode;
}

const NavigationToIndex = () => <Navigate to="/meeting_rooms" replace />;

function AdminRoutes() {
  return (
    <Accessor>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route path="users" element={<AdminUsersList />}>
            <Route path="new" element={<AdminAddUserForm />} />
            <Route path="edit/:userId" element={<AdminAddUserForm />} />
          </Route>
          <Route path="rooms" element={<AdminRoomsList />}>
            <Route path="new" element={<AdminAddRoomFrom />} />
            <Route path="edit/:roomId" element={<AdminAddRoomFrom />} />
            <Route
              path="reservations/:roomId"
              element={<AdminReservationList />}
            />
          </Route>
        </Route>
      </Routes>
    </Accessor>
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/" index element={<NavigationToIndex />} />
        <Route path="meeting_rooms" element={<MeetingRoomsLayout />}>
          <Route index element={<MeetingRoomsList />} />
          <Route path=":roomId" element={<MeetingRoom />} />
        </Route>
      </Route>
    </Routes>
  );
}

function SWRApiProvider({ children }: ProviderProps) {
  const api = useApi();

  const swrConfig: SWRConfiguration = {
    suspense: true,
    fetcher: api.get,
  };

  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}

export function App() {
  return (
    <Authenticator>
      <SWRApiProvider>
        <AppRouter />
      </SWRApiProvider>
    </Authenticator>
  );
}
