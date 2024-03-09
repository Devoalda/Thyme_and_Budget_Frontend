import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import FoodItemCard from "../components/FoodItemCard";

// Custom hook to render food items
export const useRenderFoodItems = (food) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const itemsPerRow = Math.floor(windowWidth / 24);
    let rows = [];
    let row = [];

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    food.forEach((item, index) => {
        if (index % itemsPerRow === 0 && index !== 0) {
            rows.push(<Row justify={"center"} key={index}>{row}</Row>);
            row = [];
        }
        row.push(<Col key={index} span={24/itemsPerRow}><FoodItemCard foodItem={item}/></Col>);
    });

    // Push the last row
    if (row.length > 0) {
        rows.push(<Row justify={"center"} gutter={16} key={food.length}>{row}</Row>);
    }

    return rows;
};