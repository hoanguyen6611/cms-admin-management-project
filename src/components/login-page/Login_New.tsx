import React, { SyntheticEvent, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { notification } from "antd";
import DoneIcon from "@mui/icons-material/Done";
import { EKey } from "@/models";
import { useRouter } from "next/router";

const theme = createTheme();

export const Logins = () => {
  const [buttonSignIn, setButtonSignIn] = useState(false);
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setButtonSignIn(true);
    const data = new FormData(event.currentTarget);
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/account/login",
      {
        username: data.get("username"),
        password: data.get("password"),
        app: "cms",
      }
    );
    if (res.data.result) {
      await router.push("/");
      notification.open({
        message: "Đăng nhập thành công",
        icon: <DoneIcon style={{ color: "#52c41a" }} />,
      });
      localStorage.setItem(EKey.TOKEN, res.data.data.token);
      localStorage.setItem("username", res.data.data.username);
    } else if (!res.data.result) {
      notification.open({
        message: "Thông tin đăng nhập chưa chính xác",
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Tên đăng nhập"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              disabled={buttonSignIn}
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng nhập
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
