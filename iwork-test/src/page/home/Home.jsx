import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Modal, Input, Empty, Spin } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import 'react-toastify/dist/ReactToastify.css'

import axios from 'axios';
import "./home.scss";
import { toast } from 'react-toastify';

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    axios.get('https://backend-6qco.onrender.com/users')
      .then((response) => {
        setData(response?.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
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
          <a href="#" onClick={() => showEditModal(record._id)}><EditOutlined style={{  fontSize: '20px' }} /></a>
        </Space>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (text, record) => (
        <Space size="middle">
          <a href="#" onClick={() => showDeleteModal(record._id)}><DeleteOutlined style={{ color: 'red', fontSize: '20px' }} /></a>
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
    axios.post('https://backend-6qco.onrender.com/add-user', {
      firstName: firstName,
      lastName: lastName,
    })
    .then((response) => {
      setData([...data, response.data]);
      setIsAddModalVisible(false);
      setFirstName('');
      setLastName('');

      toast.success('User added successfully!', {
        position: 'top-center',
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      console.error('Error adding user:', error);
      toast.error('Something went wrong, please try again later!', {
        position: 'top-center',
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  };

  const handleEditOk = () => {
    axios.put(`https://backend-6qco.onrender.com/update-user/${editingUserId}`, {
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
      toast.success('User edited successfully!', {
        position: 'top-center',
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      console.error('Error editing user:', error);
      toast.error('Something went wrong, please try again later!', {
        position: 'top-center',
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  };

  const handleDeleteOk = () => {
    axios.delete(`https://backend-6qco.onrender.com/delete-user/${deletingUserId}`)
    .then(() => {
      const updatedData = data.filter((user) => user._id !== deletingUserId);
      setData(updatedData);
      setIsDeleteModalVisible(false);
      setDeletingUserId(null);
      toast.success('User deleted successfully!', {
        position: 'top-center',
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      console.error('Error deleting user:', error);
      toast.error('Something went wrong, please try again later!', {
        position: 'top-center',
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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

  if (loading) {
    return (
      <div className='home-container'>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className='home-container'>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className='home-container'>
      <Button type="primary" className="add-user-button" onClick={showAddModal}>
        Add User
      </Button>
      {data.length === 0 ? (
        <Empty />
      ) : (
        <Table className='table-info' dataSource={data} columns={columns} pagination={false} />
      )}

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
          style={{ marginBottom: '7px' }}
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
          style={{ marginBottom: '7px' }}
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
