import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import 'react-chatbot-kit/build/main.css'
import Registration from './pages/Registration';
import Login from './pages/Login';
import ViewFoodItems from './pages/ViewFoodItems';
import Error from './pages/Error';
import Logout from './pages/Logout';
import MyProfile from './pages/Profile';
import MyFoodItems from './pages/MyFoodItems';
import NewFoodItem from './pages/NewFoodItem';
import ReserveFoodItems from './pages/ReserveFoodItems';
import ConfirmFoodCollection from './pages/ConfirmFoodCollection';
import AdminHome from "./pages/AdminHome";
import Home from './pages/Home';

function App() {
    return (<Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/viewfooditems"element={<ViewFoodItems/>}/>
                <Route path="/registration" element={<Registration/>}/>
                <Route path="/myfooditems" element={<MyFoodItems/>}/>
                <Route path="/newfooditem" element={<NewFoodItem/>}/>
                <Route path="/reservefooditems" element={<ReserveFoodItems/>}/>
                <Route path="/confirmfoodcollection" element={<ConfirmFoodCollection/>}/>
                <Route path="/profile" element={<MyProfile/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/logout" element={<Logout/>}/>    
                <Route path="/admin" element={<AdminHome/>}/>
                <Route path="*" element={<Error/>}/>
            </Routes>
        </Router>);
}

export default App;