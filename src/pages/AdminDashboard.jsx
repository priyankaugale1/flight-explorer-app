// pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, Modal, Form, DatePicker, InputNumber } from "antd";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newFlight, setNewFlight] = useState({
    airline: "",
    from: "",
    to: "",
    departureTime: "",
    seats: 0,
    booked: 0,
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFlight, setEditFlight] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const storedFlights = JSON.parse(localStorage.getItem("adminFlights")) || [];
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setFlights(storedFlights);
    setBookings(storedBookings);
  }, []);

  const handleInputChange = (e) => {
    setNewFlight({ ...newFlight, [e.target.name]: e.target.value });
  };

  const validateFlight = () => {
    const { airline, from, to, departureTime, seats } = newFlight;
    if (!airline || !from || !to || !departureTime || !seats) {
      toast.error("Please fill in all fields.");
      return false;
    }
    if (Number(seats) <= 0) {
      toast.error("Seats must be greater than 0.");
      return false;
    }
    return true;
  };

  const addFlight = () => {
    if (!validateFlight()) return;

    const updatedFlights = [...flights, { ...newFlight, id: Date.now(), booked: 0 }];
    setFlights(updatedFlights);
    localStorage.setItem("adminFlights", JSON.stringify(updatedFlights));
    setNewFlight({ airline: "", from: "", to: "", departureTime: "", seats: 0 });
    toast.success("Flight added successfully!");
  };

  const deleteFlight = (id) => {
    const updated = flights.filter((f) => f.id !== id);
    setFlights(updated);
    localStorage.setItem("adminFlights", JSON.stringify(updated));
    toast.success("Flight deleted.");
  };

  const showEditModal = (flight) => {
    setEditFlight(flight);
    setEditModalVisible(true);
    form.setFieldsValue({
      airline: flight.airline,
      from: flight.from,
      to: flight.to,
      departureTime: dayjs(flight.departureTime),
      seats: flight.seats,
    });
  };

  const handleEditSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedFlights = flights.map((f) =>
          f.id === editFlight.id
            ? { ...editFlight, ...values, departureTime: values.departureTime.toISOString() }
            : f
        );
        setFlights(updatedFlights);
        localStorage.setItem("adminFlights", JSON.stringify(updatedFlights));
        setEditModalVisible(false);
        toast.success("Flight updated successfully!");
      })
      .catch(() => {
        toast.error("Please correct the form errors.");
      });
  };

  const flightColumns = [
    { title: "Airline", dataIndex: "airline", key: "airline" },
    { title: "From", dataIndex: "from", key: "from" },
    { title: "To", dataIndex: "to", key: "to" },
    {
      title: "Departure Time",
      dataIndex: "departureTime",
      key: "departureTime",
      render: (text) => new Date(text).toLocaleString(),
    },
    { title: "Seats", dataIndex: "seats", key: "seats" },
    { title: "Booked", dataIndex: "booked", key: "booked" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button style={{ backgroundColor: "#1f3b73", color:'white',borderColor:'#1f3b73' }} onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Button danger onClick={() => deleteFlight(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <ToastContainer position="top-right" autoClose={2500} />
      <h2>Admin Dashboard - Flight Management</h2>

      <h3>Add New Flight</h3>
      <div className="add-flight-section">
        <Input
          name="airline"
          placeholder="Airline"
          value={newFlight.airline}
          onChange={handleInputChange}
        />
        <Input
          name="from"
          placeholder="From"
          value={newFlight.from}
          onChange={handleInputChange}
        />
        <Input
          name="to"
          placeholder="To"
          value={newFlight.to}
          onChange={handleInputChange}
        />
        <Input
          name="departureTime"
          type="datetime-local"
          value={newFlight.departureTime}
          onChange={handleInputChange}
        />
        <Input
          name="seats"
          type="number"
          placeholder="Seats"
          value={newFlight.seats}
          onChange={handleInputChange}
        />
        <Button type="primary" onClick={addFlight}>
          Add Flight
        </Button>
      </div>

      <h3 style={{ marginTop: 32 }}>Manage Flights</h3>
      <Table
        dataSource={flights}
        columns={flightColumns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Edit Flight"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="airline" label="Airline" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="from" label="From" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="to" label="To" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="departureTime" label="Departure Time" rules={[{ required: true }]}>
            <DatePicker showTime format="YYYY-MM-DDTHH:mm" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="seats" label="Seats" rules={[{ required: true, type: "number", min: 1 }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      <div style={{ marginTop: 40, textAlign: "center" }}>
        <Button style={{ backgroundColor: "#1f3b73", color:'#fff', borderColor:'#1f3b73' }} onClick={() => navigate("/admin/bookings")}>
          View Booked Details
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
