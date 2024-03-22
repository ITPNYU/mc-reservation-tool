import '../styles.css';

import NavBar from '../components/navBar';
import { Outlet } from 'react-router-dom';
import React from 'react';

export default function Root() {
  return (
    <>
      {/* TODO wrap Provider here for global state */}
      <NavBar />

      {/* This is where child route content renders, i.e. the subpages */}
      <Outlet />
    </>
  );
}
