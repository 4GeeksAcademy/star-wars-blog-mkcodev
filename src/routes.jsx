import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={
      <div className="container text-center mt-5">
        <h1 style={{ color: '#ffe81f' }}>404</h1>
        <p className="text-muted">This is not the page you are looking for.</p>
        <a href="/" className="btn btn-outline-warning mt-2">Go home</a>
      </div>
    }>
      <Route path="/" element={<Home />} />
      <Route path="/:type/:id" element={<Single />} />
    </Route>
  )
);
