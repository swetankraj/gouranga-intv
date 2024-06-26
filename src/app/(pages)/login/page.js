"use client";
import React, { useState } from "react";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { Box } from "@mui/system";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";

const Login = () => {
  const isClient = typeof window !== undefined ? true : false;
  const history = useRouter();
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [callingApi, setCallingApi] = useState("");
  const handleChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (formData) => {
    if (validateInput(formData)) {
      setCallingApi(true);
      try {
        if (isClient) {
          const user = localStorage.getItem("username");
          const pass = localStorage.getItem("password");

          if (user == formData.username && pass == formData.password) {
            enqueueSnackbar("Logged in successfully", { variant: "success" });
            localStorage.setItem("loggedIn", true);
            console.log("loggedIn");
            history.push("/");
          } else
            enqueueSnackbar("Username or password is incorrect", {
              variant: "error",
            });
        }
      } catch (error) {
        console.error(error);
      }
      setCallingApi(false);
    }
  };

  const validateInput = (data) => {
    if (!data.username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    } else if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    } else if (!data.password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    } else if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    } else return true;
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content content flex justify-center items-center h-[70vh] md:justify-end">
        <Stack
          spacing={2}
          className="form bg-white rounded-lg p-[2rem] min-w-[80%] md:min-w-[384px] m-[2rem]"
        >
          <h2 className="title text-[#00a278]">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={loginForm.username}
            onChange={handleChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={loginForm.password}
            onChange={handleChange}
          />
          {callingApi ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button
              className="button bg-secondary hover:bg-[#00845c]"
              variant="contained"
              onClick={() => login(loginForm)}
            >
              LOGIN TO QKART
            </Button>
          )}

          <p className="py-4 px-0">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="link font-[700] text-primary focus:text-secondary"
            >
              Register now
            </Link>
          </p>
          <p>Register with a username and password and use it to login</p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
