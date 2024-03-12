import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
import Layout from './components/Layout';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';
import Error from './pages/Error';
import Logout from './pages/Logout';
import MyProfile from './pages/Profile';
import MyFoodItems from './pages/MyFoodItems';
import NewFoodItem from './pages/NewFoodItem';
import ReserveFoodItems from './pages/ReserveFoodItems';
import ConfirmFoodCollection from './pages/ConfirmFoodCollection';
import AdminHome from "./pages/AdminHome";

function App() {
    return (<Router>
            <Routes>
                <Route path="/" element={<Registration/>}/>
                <Route path="/myfooditems" element={<MyFoodItems/>}/>
                <Route path="/newfooditem" element={<NewFoodItem/>}/>
                <Route path="/reservefooditems" element={<ReserveFoodItems/>}/>
                <Route path="/confirmfoodcollection" element={<ConfirmFoodCollection/>}/>
                <Route path="/profile" element={<MyProfile/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/logout" element={<Logout/>}/>
                <Route
                    path="/home"
                    element={<Layout>
                        <Home/>
                    </Layout>}
                />
                <Route path="/admin" element={<AdminHome/>}/>
                <Route path="*" element={<Error/>}/>
            </Routes>
        </Router>);
}

export default App;