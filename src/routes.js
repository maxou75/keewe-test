import {Navigate, useRoutes} from 'react-router-dom';
import HomeLayout from './layouts/home';
import Payments from "./components/payments";
import Conversions from "./components/conversions";
import Historic from "./components/historic";

export default function Router() {

    return useRoutes([
        {
            path: '/',
            element: <HomeLayout homePage={true}/>,
            children: [
                { path: 'payments', element: <Payments /> },
                { path: 'conversions', element: <Conversions /> },
                { path: 'historic', element: <Historic /> },
            ]
        },
        {
            path: '*',
            element: <Navigate to="/" replace />,
        },
    ])
}