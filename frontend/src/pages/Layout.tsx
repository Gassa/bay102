import React from "react";
import { Outlet } from "react-router-dom";
import Container from "@mui/material/Container";
import Header from './components/Header'
import Footer from './components/Footer'

export default function PageLayout() {
  return (
    <Container maxWidth="sm">
        <Header />
        <Outlet />
        <Footer /> 
    </Container>
  );
}
