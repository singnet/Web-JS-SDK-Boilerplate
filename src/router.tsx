import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    Navigate
} from "react-router-dom";
import TokenPurchase from 'pages/TokenPurchase/TokenPurchase';
import ExampleService from 'pages/ExampleService/ExampleService';
import { Layout } from 'components/Layout/Layout';
import { appConfig } from "config/app";
import TestExampleService from "pages/ExampleService/TestExampleService";

const exampleService = () => {
    if (appConfig.isTestnet) return <TestExampleService />
    return <ExampleService />
}

const links = [
    { path: '/web-sdk', label: 'Web SDK', element: exampleService() },
    { path: '/buy-token', label: 'Buy AGIX Token', element: <TokenPurchase /> },
];

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout children={<Outlet />}
            links={links} />,
        errorElement: <Navigate to={'/'} replace />,
        children: [
            {
                index: true,
                element: <Navigate to={links[0].path} replace />
            },
            ...links
        ]
    }
]);

function AppRouter() {
    return <RouterProvider router={router} />
}

export default AppRouter;
