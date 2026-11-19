import App from "@/App";
import Catalogs from "@/components/modules/Operational/Catalogs";
import IR from "@/components/modules/Operational/IR";
import JCC from "@/components/modules/Operational/JCC";
import NCR from "@/components/modules/Operational/NCR";
import timesheet from "@/components/modules/Operational/timesheet";
import Wopr from "@/components/modules/Operational/Wopr";
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router";
export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: Home,
        index: true,
      },
      {
        Component: Wopr,
        path: "/Wopr",
      },
      {
        Component: Catalogs,
        path: "/catalogs",
      },
      {
        Component: timesheet,
        path: "/timesheet",
      },
      {
        Component: JCC,
        path: "/jcc",
      },
      {
        Component: IR,
        path: "/ir",
      },
      {
        Component: NCR,
        path: "/ncr",
      },
    ],
  },
]);
