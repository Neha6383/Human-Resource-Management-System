import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import HRDashboard from './pages/HRDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import Unauthorized from './pages/Unauthorized'
import RoleManagement from './pages/RoleManagement'

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
    element={<RoleManagement />}
/>
                
    </Routes>

    </BrowserRouter>
    

  )
}

export default App
