import React, {useEffect, useState} from 'react';
import {Col, message, Row, Spin, Typography, Pagination, Input, Select } from 'antd';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import FoodItemCard from "../components/FoodItemCard";
import NoFoodItemCard from "../components/NoFoodItemCard";
import LayoutComponent from '../components/Layout';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function ViewFoodItems() {
    const [food, setFood] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [sortOption, setSortOption] = useState('');
    //const [role, setRole] = useState(null);

    const token = localStorage.getItem('token');

    // useEffect(() => {
    //     if (!token) {
    //         navigate('/login');
    //         return;
    //     }
    //     axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/user/status/`, {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     })
    //         .then(statusResponse  => {
    //             setRole(statusResponse.data.role);
    //             fetchFoodData(setFood, setLoading, setNextPageUrl, setTotalPages, token);
    //         })
    //         .catch(statusError  => {
    //             console.error('Error getting user status:', statusError);
    //             navigate('/login');
    //         });
    // }, [token]);

    useEffect(() => {
        fetchFoodData(setFood, setLoading, setNextPageUrl, setTotalPages, token, currentPage, searchTerm, sortOption);
    }, [token]);

    const handlePageChange = async page => {
        setCurrentPage(page);
        fetchFoodData(setFood, setLoading, setNextPageUrl, setTotalPages, token, page, searchTerm, sortOption);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        fetchFoodData(setFood, setLoading, setNextPageUrl, setTotalPages, token, currentPage, e.target.value, sortOption)
    };

    const onSearch = (value) => {
        fetchFoodData(setFood, setLoading, setNextPageUrl, setTotalPages, token, currentPage, value, sortOption);
    };

    const handleSortChange = (value) => {
        setSortOption(value);
        fetchFoodData(setFood, setLoading, setNextPageUrl, setTotalPages, token, currentPage, searchTerm, value);
    };

    return (
        <LayoutComponent>
            <div>
                <Title level={2} style={{ textAlign: 'center', margin: '16px 0' }}>Food Items</Title>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
                    <Search
                        placeholder="Search food items"
                        onChange={handleSearchChange}
                        onSearch={onSearch}
                        enterButton
                        style={{ width: 500, height: 40, marginRight: 16 }}
                    />
                    <Select defaultValue="" onChange={handleSortChange} style={{ width: 200 }}>
                        <Option value="">Sort by</Option>
                        <Option value="name">Name</Option>
                        <Option value="-name">Name (desc)</Option>
                        <Option value="expiry_date">Expiry date</Option>
                        <Option value="-expiry_date">Expiry date (desc)</Option>
                        <Option value="quantity">Quantity</Option>
                        <Option value="-quantity">Quantity (desc)</Option>
                    </Select>
                </div>
                <Row gutter={16} style={{ margin: '0 16px' }}>
                    {loading ? (
                        <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />
                    ) : food.length > 0 ? (
                        food.map((item, index) => (
                            <Col key={index} span={8}>
                                <FoodItemCard foodItem={item} />
                            </Col>
                        ))
                    ) : (
                        <NoFoodItemCard />
                    )}
                </Row>
                {(nextPageUrl || currentPage <= totalPages) && (
                    <Pagination
                        current={currentPage}
                        onChange={handlePageChange}
                        total={totalPages * 10}
                        showSizeChanger={false}
                        style={{ textAlign: 'center', margin: '20px 0' }}
                    />
                )}
            </div>
        </LayoutComponent>
    );
}

async function fetchFoodData(setFood, setLoading, setNextPageUrl, setTotalPages, token, page = 1, query = '', sort = '') {
    try {
        const config = token ? {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        } : {};
        let url = `${process.env.REACT_APP_BACKEND_URL}/food/?page=${page}`;
        if (query) {
            url += `&name=${query}`;
        }
        if (sort) {
            url += `&sort_by=${sort}`;
        }
        const response = await axios.get(url, config);
        setFood(response.data.results);
        setNextPageUrl(response.data.links.next);
        setTotalPages(response.data.total_pages);
    } catch (error) {
        message.error('Failed to fetch food items. Please try again.');
    } finally {
        setLoading(false);
    }
}