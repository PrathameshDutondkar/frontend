import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; 
import "./login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuthentication = async () => {
    try {
      setLoading(true);

      
      const response = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Sign-in successful");
        navigate("/home");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("An error occurred during sign-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="background-image" />

      <div className="form-container">
        <h2 className="form-title">Sign In</h2>
        <Form name="basic" initialValues={{ remember: true }} onFinish={handleAuthentication}>
          <Form.Item
            className="form-item"
            label="username"
            name="email"
            rules={[
              { required: true, message: "Please input your email address!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input
              placeholder="Enter your email address"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            className="form-item"
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <div className="form-button">
            <Button htmlType="submit" className="custom-button" loading={loading}>
              {loading ? "Signing In" : "Sign In"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
