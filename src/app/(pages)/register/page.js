"use client";

import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [callingApi, setCallingApi] = useState(false);
  const history = useRouter();

  const isClient = typeof window !== undefined ? true : false;

  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
    console.log(registerForm);
  };

  const register = async (formData) => {
    console.log("clicked");

    if (validateInput(formData)) {
      console.log("validated");
      setCallingApi(true);

      try {
        if (isClient) {
          localStorage.setItem("username", formData.username);
          localStorage.setItem("password", formData.password);
          enqueueSnackbar("Registered successfully", { variant: "success" });
          history.push("/login");
        }
      } catch (error) {
        //when server is active and we got error, it is usually in 400 series.
        if (error.response && error.response.status === 400) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
        } else {
          //when server is not active we get error is 500 series
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
            { variant: "error" }
          );
        }
      } finally {
        setCallingApi(false);
      }
    }
  };

  const validateInput = (data) => {
    console.log("reached validation");
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
    } else if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    } else return true;
    // console.log(data);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content flex justify-center items-center h-[70vh] md:justify-end">
        <Stack
          spacing={2}
          className="form bg-white rounded-lg p-[2rem] min-w-[80%] md:min-w-[384px]  m-[2rem]"
        >
          <h2 className="text-[#00a278]">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={registerForm.username}
            onChange={handleChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={registerForm.password}
            onChange={handleChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={registerForm.confirmPassword}
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
              onClick={() => register(registerForm)}
            >
              Register Now
            </Button>
          )}
          <p className="py-4 px-0">
            Already have an account?{" "}
            <Link
              href="/login"
              className="link font-[700] text-primary focus:text-secondary"
            >
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
