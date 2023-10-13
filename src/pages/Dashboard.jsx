import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Dashboard/Sidebar';

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col md:flex-row min-h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-richblack-900">
        <div className="mx-auto w-full sm:max-w-[400px] md:max-w-[500px] lg:max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
