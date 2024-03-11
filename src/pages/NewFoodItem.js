import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, DatePicker, Form, Input, InputNumber, message, Space, Typography, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import LayoutComponent from '../components/Layout';

const { Title, Text } = Typography;

const NewFoodItem = () => {
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        // Get token from local storage
        const token = localStorage.getItem('token');

        // Check if token is present
        if (!token) {
            // Redirect to login page if token is not present
            navigate('/login');
        }
    }, [navigate]);

    const postFoodItem = async (values, base64Image) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/food/`, {
            name: values.name,
            expiry_date: values.expiry_date.format('YYYY-MM-DD'),
            quantity: values.quantity,
            postal_code: values.postal_code,
            image: base64Image,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        message.success('Food item created successfully!');
            navigate('/home');
        } catch (error) {
            message.error('Failed to create food item');
            console.error(error);
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg';
        if (!isJpgOrJpeg) {
            message.error('You can only upload JPG/JPEG file!');
        }
        return isJpgOrJpeg ? true : Upload.LIST_IGNORE;
    };

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const onFinish = async (values) => {
        if (fileList.length === 0) {
            message.error('Please upload an image.');
            return;
        }

        const file = fileList[0].originFileObj;
        const base64Image = await convertFileToBase64(file);
        
        postFoodItem(values, base64Image);
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    return (
        <LayoutComponent>
            <div style={styles.container}>
                <Space direction="vertical" size="middle" style={styles.space}>
                    <Title level={2}>Add New Food Item</Title>
                    <Text>Share food, save the planet</Text>
                    <Form
                        name="newFoodItem"
                        onFinish={onFinish}
                        initialValues={{ remember: true }}
                        scrollToFirstError
                        layout="vertical"
                    >
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please input the food item name!' }]}
                        >
                            <Input placeholder="Enter food name" />
                        </Form.Item>
                        <Form.Item
                            name="expiry_date"
                            label="Expiry Date"
                            rules={[{ required: true, message: 'Please input the expiry date!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label="Quantity"
                            rules={[{ required: true, message: 'Please input the quantity!' }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter quantity" />
                        </Form.Item>
                        <Form.Item
                            name="postal_code"
                            label="Collection Postal Code"
                            rules={[{ required: true, message: 'Please input the postal code!' }]}
                        >
                            <Input placeholder="Enter postal code" />
                        </Form.Item>
                        <Form.Item
                            name="image"
                            label="Food Image"
                            rules={[{ required: true, message: 'Please upload an image!' }]}
                        >
                            <Upload
                                listType="picture"
                                beforeUpload={beforeUpload}
                                onChange={onChange}
                                onRemove={() => setFileList([])}
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Upload Image</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Submit Food Item
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
            </div>
        </LayoutComponent>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '700px',
        margin: '40px auto',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.1)'
    },
    space: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
};


export default NewFoodItem;
