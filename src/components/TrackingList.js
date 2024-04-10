import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import Establishments from './Establishments';
import AnnualRecords from './AnnualRecordForm';

const TrackingList = () => {
  return (
    <div>
      <nav>
        <Link to="establishments">Establishments</Link> |
        <Link to="fsic-positive-negative">FSIC Positive and Negative</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default TrackingList;
