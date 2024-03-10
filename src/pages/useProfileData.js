import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useProfileData = () => {
    const initialFormData = {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        phoneNumber: '',
        postalCode: '',
    };

    const [formData, setFormData] = useState({});
    const [dataFetched, setDataFetched] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchData = useCallback(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/user/status/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(statusResponse => {
            console.log(statusResponse.data.role);
        })
        .catch(statusError => {
            console.error('Error getting user status:', statusError);
            navigate('/login');
        });

        axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000'}/user/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            const userData = response.data;
            setFormData({
                username: userData.username,
                firstName: userData.first_name,
                lastName: userData.last_name,
                email: userData.email,
                role: userData.role,
                phoneNumber: userData.phone_number,
                postalCode: userData.postal_code,
            });
            setDataFetched(true);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }, [navigate, token]);

    const clearData = () => {
        setFormData(initialFormData);
    }

    return { formData, setFormData, dataFetched, fetchData };
};

export default useProfileData;