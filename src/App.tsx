import { Dashboard } from './Dashboard';

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate
} from "react-router-dom";
// import { SponsoredGasExample } from './examples/SponsoredGasExample';
// import { BatchExample } from './examples/BatchExample';
import SimplexPurchase from './examples/SimplexPurchase';
import ExampleService from './examples/ExampleService';

const links = [
  // { path: '/gas-free', label: 'Pay Gas for Users', element: <SponsoredGasExample /> },
  // { path: '/service', label: 'AI Services', element: <BatchExample /> },
  { path: '/web-sdk', label: 'Web SDK', element: <ExampleService /> },
  { path: '/buy-token', label: 'Buy AGIX Token', element: <SimplexPurchase /> },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard children={<Outlet />}
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

function App() {
  return <RouterProvider router={router} />
}

export default App;
