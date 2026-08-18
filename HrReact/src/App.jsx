import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import HRDashboard from './pages/HRDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import Unauthorized from './pages/Unauthorized'
import RoleManagement from './pages/RoleManagement'
import EmployeeManagement from "./pages/EmployeeManagement";
import AddEmployee from "./pages/AddEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import EditEmployee from "./pages/EditEmployee";
import DepartmentManagement from "./pages/DepartmentManagement";
import EmployeeAttendance from './pages/EmployeeAttendance'
import EmployeeProfile from './pages/EmployeeProfile'

import ProtectedRoute from './components/ProtectedRoute'

function App() {


  return (
    <BrowserRouter>
    <Routes>
      {/* Public Route */}
      <Route
    path="/"
    element={<Navigate to="/login" replace />}
/>

      <Route path='/login' element={<Login />}/>

      {/* Admin Dashboard */}

      <Route path='/admin/dashboard'
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
       />

<Route
    path="/employees"
    element={
        <ProtectedRoute allowedRoles={["Admin", "HR"]}>
            <EmployeeManagement />
        </ProtectedRoute>
    }
/>

<Route
    path="/employees/:id"
    element={
        <ProtectedRoute allowedRoles={["Admin", "HR"]}>
            <EmployeeDetails />
        </ProtectedRoute>
    }
/>

<Route
    path="/employees/add"
    element={
        <ProtectedRoute allowedRoles={["Admin", "HR"]}>
            <AddEmployee />
        </ProtectedRoute>
    }
/>

<Route
    path="/employees/edit/:id"
    element={
        <ProtectedRoute allowedRoles={["Admin", "HR"]}>
            <EditEmployee />
        </ProtectedRoute>
    }
/>

       {/* HR Dashboard */}

                <Route
                    path="/hr/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={["HR"]}
                        >
                            <HRDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* Employee Dashboard */}

                <Route
                    path="/employee/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={["Employee"]}
                        >
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Unauthorized */}

                <Route
                    path="/unauthorized"
                    element={<Unauthorized />}
                />

                <Route
    path="/roles"
    element={
        <ProtectedRoute allowedRoles={["Admin"]}>
            <RoleManagement />
        </ProtectedRoute>
    }
/>

<Route
    path="/departments"
    element={
        <ProtectedRoute
            allowedRoles={["Admin", "HR"]}
        >
            <DepartmentManagement />
        </ProtectedRoute>
    }
/>

<Route
    path="/employee/attendance"
    element={
        <EmployeeAttendance />
    }
/>

<Route
    path="/employee/profile"
    element={
        <EmployeeProfile />
    }
/>
                
    </Routes>
    

    </BrowserRouter>
    

  )
}

export default App
