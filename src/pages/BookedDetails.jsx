// pages/BookedDetails.jsx
import React, { useEffect, useState } from "react";
import { Table, Input, Space, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import "antd/dist/reset.css";
import "../styles/BookedDetails.css";

const BookedDetails = () => {
    const [bookings, setBookings] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("bookings")) || [];
        setBookings(stored);
        setFiltered(stored);
    }, []);

    useEffect(() => {
        const lower = search.toLowerCase();
        const filteredData = bookings.filter(
            (b) =>
                b.passenger.name.toLowerCase().includes(lower) ||
                b.passenger.email.toLowerCase().includes(lower) ||
                b.flight?.airline?.name.toLowerCase().includes(lower)
        );
        setFiltered(filteredData);
    }, [search, bookings]);

    const columns = [
        { title: "Booking ID", dataIndex: "bookingId", key: "bookingId", responsive: ["sm"] },
        { title: "Passenger Name", dataIndex: ["passenger", "name"], key: "name" },
        { title: "Email", dataIndex: ["passenger", "email"], key: "email", responsive: ["md"] },
        { title: "Airline", dataIndex: ["flight", "airline", "name"], key: "airline" },
        { title: "From", dataIndex: ["flight", "departure", "iata"], key: "from" },
        { title: "To", dataIndex: ["flight", "arrival", "iata"], key: "to" },
        {
            title: "Booked On",
            dataIndex: "date",
            key: "date",
            render: (text) => new Date(text).toLocaleString(),
        }
    ];

    return (
        <div className="booked-container">
            <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item>
                    <Link to="/admin">Admin Dashboard</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Booked Details</Breadcrumb.Item>
            </Breadcrumb>


            <h2 className="booked-details-header">Booked Flights Details</h2>

            <Space direction="vertical" style={{ width: "100%" }}>
                <div className="search-bar">
                    <Input
                        placeholder="Search by passenger, email, or airline"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                    />
                </div>
            </Space>

            <Table
                dataSource={filtered}
                columns={columns}
                rowKey="bookingId"
                pagination={{ pageSize: 5 }}
                scroll={{ x: true }}
                className="booked-table"
            />
        </div>
    );
};

export default BookedDetails;
