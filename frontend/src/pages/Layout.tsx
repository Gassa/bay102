import React from "react";
import { Outlet } from "react-router-dom";
import Container from "@mui/material/Container";

export default function PageLayout() {
  return (
    <Container maxWidth="sm">
        <div>logo</div>
        <div>nav</div>
        <Outlet />
        <div>footer</div>
    </Container>
  );
}
