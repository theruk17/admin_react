import * as React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import ErrorPage404 from "../404";
import Login from "../Pages/Login";
import MonitorData from "../Pages/MonitorData";
import Upload_data from "../Pages/Upload_data";
import CaseData from "../Pages/CaseData";
import NbData from "../Pages/NbData";
import LcData from "../Pages/LcData";
import FanData from "../Pages/FanData";
import HSData from "../Pages/HSData";
import KBData from "../Pages/KBData";
import KCapData from "../Pages/KeyCapData";
import CHData from "../Pages/CHData";
import MouseData from "../Pages/MouseData";
import MousePadData from "../Pages/MousePadData";
import MICData from "../Pages/MICData";
import SinkData from "../Pages/SinkData";
import '../index.css'

const Routes = () => {
    const { token } = useAuth();

    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <ProtectedRoute />,
            errorElement: <ErrorPage404 />,
            children: [
                {
                    path: "/",
                    element: <MonitorData />,
                },
                {
                    path: "/monitor",
                    element: <MonitorData />,
                },
                {
                    path: "/upload",
                    element: <Upload_data />,
                },
                {
                    path: "/case",
                    element: <CaseData />,
                },
                {
                    path: "/nb",
                    element: <NbData />,
                },
                {
                    path: "/lc",
                    element: <LcData />,
                },
                {
                    path: "/fan",
                    element: <FanData />,
                },
                {
                    path: "/headset",
                    element: <HSData />,
                },
                {
                    path: "/kb",
                    element: <KBData />,
                },
                {
                    path: "/kcap",
                    element: <KCapData />,
                },
                {
                    path: "/ch",
                    element: <CHData />,
                },
                {
                    path: "/mouse",
                    element: <MouseData />,
                },
                {
                    path: "/mousepad",
                    element: <MousePadData />,
                },
                {
                    path: "/mic",
                    element: <MICData />,
                },
                {
                    path: "/sink",
                    element: <SinkData />,
                }

            ],
        }
    ]

    const routesForNotAuthenticatedOnly = [
        {
            path: "/login",
            element: <Login />,
        },
    ];

    const router = createBrowserRouter([
        ...(!token ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
    ]);

    return <RouterProvider router={router} />;

}
export default Routes;
