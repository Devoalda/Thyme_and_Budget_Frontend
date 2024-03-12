import React, {useEffect, useState} from 'react';
import {Col, message, Row, Spin, Typography, Pagination, Input } from 'antd';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import FoodItemCard from "../components/FoodItemCard";
import NoFoodItemCard from "../components/NoFoodItemCard";

const { Title } = Typography;
const { Search } = Input;

const rowStyle = {
    margin: '0 0 0 10px',
};

export default function Home() {
    const [food, setFood] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchFoodData(setFood, setLoading, setNextPageUrl, setTotalPages, token);
    }, [token]);

    const handlePageChange = async page => {
        setCurrentPage(page);
        fetchFoodData(setFood, setLoading, setNextPageUrl, setTotalPages, token, page);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        fetchFoodData(setFood, setLoading, setNextPageUrl, setTotalPages, token, currentPage, e.target.value)
    };

    const onSearch = (value) => {
        fetchFoodData(setFood, setLoading, setNextPageUrl, setTotalPages, token, currentPage, value);
    };

    return (
        <div>
            <Title level={2} style={{ textAlign: 'center', margin: '16px 0' }}>Food Items</Title>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
                <Search
                    placeholder="Search food items"
                    onChange={handleSearchChange}
                    onSearch={onSearch}
                    enterButton
                    style={{ width: 500, height: 40 }}
                />
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
    );
}

async function fetchFoodData(setFood, setLoading, setNextPageUrl, setTotalPages, token, page = 1, query = '') {
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