import React from 'react';
import { Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <Row justify="end" align="middle" style={{ height: '100%' }}>
            <Col>
                <Button type="link" style={{ marginRight: 16 }}>
                    <Link to="/login">Login</Link>
                </Button>
                <Button type="primary">
                    <Link to="/registration">Registration</Link>
                </Button>
            </Col>
        </Row>
    );
}
