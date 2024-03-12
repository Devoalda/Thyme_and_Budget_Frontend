import React, { useEffect, useState } from 'react';
import { Table, Spin, Typography, message, Pagination, Input, Popover, Button, Modal } from 'antd';
import axios from "axios";
import LayoutComponent from "../components/Layout";

const { Title } = Typography;
const { Search } = Input;

export default function AdminHome() {
    const [food, setFood] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');
    const [modalVisible, setModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [reservedFoodItems, setReservedFoodItems] = useState([]);
    const [loadingReservedFoodItems, setLoadingReservedFoodItems] = useState(true);

    useEffect(() => {
        fetchFoodData();
        fetchReservedFoodItems();
    }, []);

    const fetchFoodData = async (page = 1, query = '') => {
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
    };

    const fetchFoodItemData = async (id, token) => {
        try {
            const config = token ? {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            } : {};
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/food/${id}/`, config);
            return response.data;
        } catch (error) {
            message.error('Failed to fetch food item. Please try again.');
        }
    };

    const fetchReservedFoodItems = async () => {
        setLoadingReservedFoodItems(true);
        try {
            const config = token ? {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            } : {};
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/collection/`, config);
            const foodItemsData = await Promise.all(response.data.map(async (item) => {
                const foodItemData = await fetchFoodItemData(item.food_item, token);
                return { ...item, foodItemData };
            }));
            setReservedFoodItems(foodItemsData);
        } catch (error) {
            message.error('Failed to fetch reserved food items. Please try again.');
        } finally {
            setLoadingReservedFoodItems(false);
        }
    };

    const deleteFoodItem = async (id) => {
        try {
            const config = token ? {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            } : {};
            const url = `${process.env.REACT_APP_BACKEND_URL}/food/${id}/`;
            await axios.delete(url, config);
            message.success('Food item deleted successfully.');
            fetchFoodData(currentPage, searchTerm); // Refresh the data
        } catch (error) {
            message.error('Failed to delete food item. Please try again.');
        }
    };

    // const confirmCollection = async (record, token) => {
    //     try {
    //         console.log('Record:', record);
    //         const requestData = {
    //             quantity: 0,
    //             phone_number: record.phone_number,
    //             food_item: record.food_item,
    //         };
    //         console.log('Request data:', requestData); // Log the request data
    //
    //         const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/collection/${record.id}/`, requestData, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //
    //         console.log('Response:', response); // Log the response
    //
    //         message.success('Food item collected successfully');
    //     } catch (error) {
    //         if (process.env.NODE_ENV === 'development') {
    //             console.error('Error confirming collection:', error);
    //         }
    //         message.error('Failed to confirm collection. Please try again.');
    //     }
    // };

    const confirmCollection = async (record, token) => {
        try {
            const requestData = {
                quantity: 0,
                phone_number: record.phone_number,
                food_item: record.food_item,
            };
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/collection/${record.id}/`, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            message.success('Food item collected successfully');
            // Update the state of reservedFoodItems
            setReservedFoodItems(prevItems => prevItems.map(item => item.id === record.id ? { ...item, quantity: 0 } : item));
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error confirming collection:', error);
            }
            message.error('Failed to confirm collection. Please try again.');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchFoodData(page, searchTerm);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        fetchFoodData(currentPage, e.target.value);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Expiry Date',
            dataIndex: 'expiry_date',
            key: 'expiry_date',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Donor',
            dataIndex: 'donor',
            key: 'donor',
        },
        {
            title: 'Actions',
            dataIndex: '',
            key: 'actions',
            render: (_, record) => (
                <Popover
                    content={
                        <div>
                            <Button type="primary" style={{ margin: '5px' }}>Update</Button>
                            {/*<Button type="primary" style={{ margin: '5px' }} onClick={() => { setCurrentRecord(record); setModalVisible(true); }}>Confirm Collection</Button>*/}
                            <Button type="primary" danger style={{ margin: '5px' }} onClick={() => deleteFoodItem(record.id)}>Delete</Button>
                        </div>
                    }
                    trigger="hover"
                >
                    <Button>Actions</Button>
                </Popover>
            ),
        },
    ];

    const columnsReservedFoodItems = [
        {
            title: 'Food Item',
            dataIndex: ['foodItemData', 'name'],
            key: 'food_item',
        },
        {
            title: 'Expiry Date',
            dataIndex: ['foodItemData', 'expiry_date'],
            key: 'expiry_date',
        },
        {
            title: 'Location',
            dataIndex: ['foodItemData', 'location'],
            key: 'location',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                record.quantity === 0 ? // Check if the item has been collected or quantity is 0
                    <span style={{color: 'green'}}>Collected</span> : // If yes, show "Collected"
                    <Button onClick={() => confirmCollection(record, token)}>Confirm Collection</Button> // If no, show the button
            ),
        },
    ];

    return (
        <LayoutComponent>
            <Title level={2} style={{ textAlign: 'center', margin: '16px 0' }}>Food Items</Title>
            <Search
                placeholder="Search food items"
                onChange={handleSearchChange}
                enterButton
                style={{ width: 500, height: 40, margin: '0 auto 16px' }}
            />
            {loading ? (
                <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />
            ) : (
                <>
                    <Table columns={columns} dataSource={food} rowKey="id" pagination={false} />
                    {(nextPageUrl || currentPage <= totalPages) && (
                        <Pagination
                            current={currentPage}
                            onChange={handlePageChange}
                            total={totalPages * 10}
                            showSizeChanger={false}
                            style={{ textAlign: 'center', margin: '20px 0' }}
                        />
                    )}
                </>
            )}
            <Title level={2} style={{ textAlign: 'center', margin: '16px 0' }}>Reserved Food Items</Title>
            {loadingReservedFoodItems ? (
                <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />
            ) : (
                <Table columns={columnsReservedFoodItems} dataSource={reservedFoodItems} rowKey="id" pagination={false} />
            )}
            <Modal
                title="Confirm Collection"
                visible={modalVisible}
                onOk={() => confirmCollection(currentRecord, token)}
                onCancel={() => setModalVisible(false)}
            >
                <p>Are you sure you want to confirm the collection of this food item?</p>
            </Modal>
        </LayoutComponent>
    );
}