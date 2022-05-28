import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./Layout";

const Home = lazy(() => import("./Home"))
const Room = lazy(() => import("./Room"))
const Result = lazy(() => import("./Result"))
export function Pages() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/result/:roomId" element={<Result />} /> 
        </Route>
      </Routes>
    </Suspense>
  );
}
