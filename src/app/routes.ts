import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { ClientPortal } from "./pages/ClientPortal";
import { EnhancedAdminDashboard } from "./pages/EnhancedAdminDashboard";
import { AuthPage } from "./pages/AuthPage";
import { DriverApplicationPage } from "./pages/DriverApplicationPage";
import { ReservationPage } from "./pages/ReservationPage";
import { PassengerPortal } from "./pages/PassengerPortal";
import PassengerDashboard from "./pages/PassengerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import { EventFlowDashboard } from "./pages/EventFlowDashboard";
import { EventFlowLogin } from "./pages/eventflow/EventFlowLogin";
import { DashboardOverview } from "./pages/eventflow/DashboardOverview";
import { EventsPage } from "./pages/eventflow/EventsPage";
import { EventDetailPage } from "./pages/eventflow/EventDetailPage";
import { ManifestPage } from "./pages/eventflow/ManifestPage";
import { DriversPage } from "./pages/eventflow/DriversPage";
import { VehiclesPage } from "./pages/eventflow/VehiclesPage";
import { DispatchBoardPage } from "./pages/eventflow/DispatchBoardPage";
import { IssuesPage } from "./pages/eventflow/IssuesPage";
import { ReportsPage } from "./pages/eventflow/ReportsPage";
import { SettingsPage } from "./pages/eventflow/SettingsPage";
import { TermsConditions } from "./pages/TermsConditions";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/auth",
    Component: AuthPage,
  },
  {
    path: "/portal",
    Component: ClientPortal,
  },
  {
    path: "/passenger",
    Component: PassengerPortal,
  },
  {
    path: "/reserve",
    Component: ReservationPage,
  },
  {
    path: "/admin",
    Component: EnhancedAdminDashboard,
  },
  {
    path: "/driver-application",
    Component: DriverApplicationPage,
  },
  {
    path: "/track/:rideId",
    Component: PassengerDashboard,
  },
  {
    path: "/driver",
    Component: DriverDashboard,
  },
  {
    path: "/eventflow/login",
    Component: EventFlowLogin,
  },
  {
    path: "/eventflow",
    Component: EventFlowDashboard,
    children: [
      {
        index: true,
        Component: DashboardOverview,
      },
      {
        path: "events",
        Component: EventsPage,
      },
      {
        path: "events/:eventId",
        Component: EventDetailPage,
      },
      {
        path: "manifest",
        Component: ManifestPage,
      },
      {
        path: "drivers",
        Component: DriversPage,
      },
      {
        path: "vehicles",
        Component: VehiclesPage,
      },
      {
        path: "dispatch",
        Component: DispatchBoardPage,
      },
      {
        path: "issues",
        Component: IssuesPage,
      },
      {
        path: "reports",
        Component: ReportsPage,
      },
      {
        path: "settings",
        Component: SettingsPage,
      },
    ],
  },
  {
    path: "/terms-conditions",
    Component: TermsConditions,
  },
]);