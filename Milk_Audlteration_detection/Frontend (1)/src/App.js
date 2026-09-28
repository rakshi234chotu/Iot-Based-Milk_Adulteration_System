import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './PublicComponents/Home';
import Login from './PublicComponents/Login';
import AdminDashboard from './AdminComponents/Admindashboard';
import ManageMilkBooth from './AdminComponents/ManageMilkBooth';
import ManageSensors from './AdminComponents/ManageSensors';
import ViewProduction from './AdminComponents/ViewProduction';
import UpdateProfile from './AdminComponents/UpdateProfile';
import ManagerDashboard from './MilkManagerComponents/Managerdashboard';
import ManageUsers from './MilkManagerComponents/ManageUsers';
import ManageProduction from './MilkManagerComponents/ManageProduction';
import ManagePayments from './MilkManagerComponents/ManagePayments';
import ManagerUpdateProfile from './MilkManagerComponents/ManagerUpdateProfile';
import UserDashboard from './UserComponents/Userdashboard';
import ViewMilk from './UserComponents/ViewMilk';
import UserPayments from './UserComponents/UserPayments';
import UpdatePassword from './UserComponents/UpdatePassword';
import ViewMilkroduction from './MilkManagerComponents/ViewMilkProduction';

function App() {
  return (
    <div className="App">
      <BrowserRouter >
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admindashboard" element={<AdminDashboard />}>
            <Route path="manage-milkbooth" element={<ManageMilkBooth />} />
            <Route path="manage-sensors" element={<ManageSensors />} />
            <Route path="view-production" element={<ViewProduction />} />
            <Route path="update-profile" element={<UpdateProfile />} />
          </Route>

          <Route path="/managerdashboard" element={<ManagerDashboard />}>
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="manage-production" element={<ManageProduction />} />
            <Route path="view-production" element={<ViewMilkroduction />} />
            <Route path="manage-payments" element={<ManagePayments />} />
            <Route path="manager-update-profile" element={<ManagerUpdateProfile />} />
          </Route>

          <Route path="/userdashboard" element={<UserDashboard />}>
            <Route path="view-milk" element={<ViewMilk />} />
            <Route path="manage-payments" element={<UserPayments />} />
            <Route path="update-password" element={<UpdatePassword />} />
          </Route>




        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
