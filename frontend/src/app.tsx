import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import Providers from './providers';

export const App = () => {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
};
