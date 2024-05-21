import { useState } from "react";
import { Box } from "@mui/material";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const [username, setUsername] = useState("");

  const history = useRouter();

  return (
    <Box className="flex justify-between items-center p-[2rem] h-[5vh] header bg-white">
      <Box
        className="header-title"
        onClick={() => {
          history.push("/");
        }}
      >
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {children}
      {/* logged in */}
      {!hasHiddenAuthButtons && username && (
        <>
          <Stack direction="row" spacing={1}>
            <Avatar alt={username} src="avatar.png" />
            <Typography pt={1}>{username}</Typography>
            <Button variant="text" onClick={handleLogout}>
              LOGOUT
            </Button>
          </Stack>
        </>
      )}

      {hasHiddenAuthButtons && (
        <Button
          className="text-[#00a278]"
          startIcon={<ArrowBackIcon />}
          variant="text"
          // to="/"
          // component={Link}
          onClick={() => {
            history.push("/");
          }}
        >
          Back To Explore
        </Button>
      )}

      {!hasHiddenAuthButtons && !username && (
        <>
          <Stack direction="row" spacing={1}>
            <Button
              variant="text"
              // to="/login" component={Link}
              onClick={() => history.push("/login")}
            >
              LOGIN
            </Button>
            <Button
              className="button"
              variant="contained"
              // to="/register"
              // component={Link}
              onClick={() => {
                history.push("/register");
              }}
            >
              REGISTER
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default Header;
