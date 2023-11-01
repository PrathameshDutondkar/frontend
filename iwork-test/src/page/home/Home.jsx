import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Modal, Input } from 'antd';
import axios from 'axios';

const Home = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    // Make a GET request to your API endpoint using Axios
    axios.get('http://localhost:8080/users')
      .then((response) => {
        // Update the data source with the fetched data
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (text, record) => (
        <Space size="middle">
          <a href="#">Edit</a>
        </Space>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (text, record) => (
        <Space size="middle">
          <a href="#">Delete</a>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // Make a POST request to add the user to the API
    axios.post('http://localhost:8080/add-user', {
      firstName: firstName,
      lastName: lastName,
    })
    .then((response) => {
      // Update the data source with the new user data
      setData([...data, response.data]);
      setIsModalVisible(false); // Close the modal
    })
    .catch((error) => {
      console.error('Error adding user:', error);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={showModal}>
        Add User
      </Button>
      <Table dataSource={data} columns={columns} />

      <Modal
        title="Add User"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Home;
