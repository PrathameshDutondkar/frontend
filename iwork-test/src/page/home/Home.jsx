import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Modal, Input } from 'antd';
import axios from 'axios';

const Home = () => {
  const [data, setData] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:8080/users')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

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
          <a href="#" onClick={() => showEditModal(record._id)}>Edit</a>
        </Space>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (text, record) => (
        <Space size="middle">
          <a href="#" onClick={() => showDeleteModal(record._id)}>Delete</a>
        </Space>
      ),
    },
  ];

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const showEditModal = (userId) => {
    const userToEdit = data.find((user) => user._id === userId);
    if (userToEdit) {
      setFirstName(userToEdit.firstName);
      setLastName(userToEdit.lastName);
      setEditingUserId(userId);
      setIsEditModalVisible(true);
    }
  };

  const showDeleteModal = (userId) => {
    setDeletingUserId(userId);
    setIsDeleteModalVisible(true);
  };

  const handleAddOk = () => {
    axios.post('http://localhost:8080/add-user', {
      firstName: firstName,
      lastName: lastName,
    })
    .then((response) => {
      setData([...data, response.data]);
      setIsAddModalVisible(false);
      setFirstName('');
      setLastName('');
    })
    .catch((error) => {
      console.error('Error adding user:', error);
    });
  };

  const handleEditOk = () => {
    axios.put(`http://localhost:8080/update-user/${editingUserId}`, {
      firstName: firstName,
      lastName: lastName,
    })
    .then((response) => {
      const updatedData = data.map((user) => {
        if (user._id === editingUserId) {
          return response.data.user;
        } else {
          return user;
        }
      });
      setData(updatedData);
      setIsEditModalVisible(false);
      setFirstName('');
      setLastName('');
      setEditingUserId(null);
    })
    .catch((error) => {
      console.error('Error editing user:', error);
    });
  };

  const handleDeleteOk = () => {
    axios.delete(`http://localhost:8080/delete-user/${deletingUserId}`)
    .then(() => {
      const updatedData = data.filter((user) => user._id !== deletingUserId);
      setData(updatedData);
      setIsDeleteModalVisible(false);
      setDeletingUserId(null);
    })
    .catch((error) => {
      console.error('Error deleting user:', error);
    });
  };

  const handleCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setIsDeleteModalVisible(false);
    setFirstName('');
    setLastName('');
    setEditingUserId(null);
    setDeletingUserId(null);
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={showAddModal}>
        Add User
      </Button>
      <Table dataSource={data} columns={columns} />

      <Modal
        title="Add User"
        visible={isAddModalVisible}
        onOk={handleAddOk}
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

      <Modal
        title="Edit User"
        visible={isEditModalVisible}
        onOk={handleEditOk}
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

      <Modal
        title="Delete User"
        visible={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </div>
  );
};

export default Home;
