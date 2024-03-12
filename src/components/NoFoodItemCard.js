import React from 'react';
import {Button, Card} from 'antd';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';

const cardStyle = {
    backgroundColor: '#f8f9fa',
    color: '#343a40',
    padding: '40px', // Increased padding
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Softer shadow
    margin: '40px auto', // Centered card with more margin
    textAlign: 'center',
    maxWidth: '500px', // Optional: constrain card width for larger screens
};

const textStyle = {
    fontSize: '18px', // Larger text
    margin: '20px 0', // Spacing above and below text
    fontWeight: 'bold', // Bold text
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)', // Soft text shadow for depth
};

const buttonStyle = {
    backgroundColor: '#28a745', // Changed to a 'success' green color
    borderColor: '#28a745',
    color: '#fff',
    width: '100%',
    padding: '10px 0', // Taller button
    fontSize: '16px', // Larger button text
    marginTop: '20px',
    display: 'flex', // Use flexbox to align items
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
};

function NoFoodItemCard() {
    const navigate = useNavigate();

    return (
        <Card style={cardStyle}>
            <p style={textStyle}>No food items found. Would you like to add one for donation?</p>
            <Button type="primary" style={buttonStyle} onClick={() => navigate('/newfooditem')}>Add Food Item</Button>
        </Card>
    );
}

export default NoFoodItemCard;
