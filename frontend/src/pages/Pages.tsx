import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./Layout";

const Home = lazy(() => import("./Home"))
const Room = lazy(() => import("./Room"))
const Event = lazy(() => import("./Event"))

export function Pages() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="room" element={<Room />} />
          <Route path="event" element={<Event />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
