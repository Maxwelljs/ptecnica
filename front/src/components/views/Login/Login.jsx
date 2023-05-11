import React, { useState } from "react";
import {
  Grid,
  Container,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  CssBaseline,
} from "@material-ui/core";
import styles from "./styles.module.css";
import { makeStyles } from "@material-ui/core/styles";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import axios from "axios";
import { useHistory } from "react-router";
import { BASE_URL } from "./../../../utils/constants";
import { Link, useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  },
  container: {
    height: "80%",
    marginTop: theme.spacing(10),
    [theme.breakpoints.down(400 + theme.spacing(2) + 2)]: {
      marginTop: 0,
      width: "100%",
      height: "100%",
    },
  },
  div: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "70%",
    marginTop: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const [body, setBody] = useState({ email: "", password: "" });
  const { push } = useHistory();
  const classes = useStyles();

  const inputChange = ({ target }) => {
    const { name, value } = target;
    setBody({
      ...body,
      [name]: value,
    });
  };

  const onSubmit = () => {
    axios
      .post(`${BASE_URL}auth/login`, body)
      .then(({ data }) => {
        localStorage.setItem("auth", '"yes"');
        push("/app");
      })
      .catch(({ response }) => {
        console.log(response.data);
      });
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Container component={Paper} elevation={5} maxWidth='sm' className={classes.container}>
        <h1 className={styles.heading}>TBBC Login Form</h1>
            <div className={classes.div}>
              <Typography component="h1" variant="h5">
                Sign In
              </Typography>
              <form className={classes.form}>
                <TextField
                  fullWidth
                  autoFocus
                  color="primary"
                  margin="normal"
                  variant="outlined"
                  label="E-mail"
                  value={body.email}
                  onChange={inputChange}
                  name="email"
                />
                <TextField
                  fullWidth
                  type="password"
                  color="primary"
                  margin="normal"
                  variant="outlined"
                  label="Password"
                  value={body.password}
                  onChange={inputChange}
                  name="password"
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  onClick={onSubmit}
                >
                  Sign In
                </Button>
              </form>
              <p className={styles.text}>or</p>
              <button
                className={styles.google_btn}
                onClick={console.log("click")}
              >
                <img src="./images/google.png" alt="google icon" />
                <span>Sing in with Google</span>
              </button>
              <p className={styles.text}>
                New Here ? <Link to="/signup">Sing Up</Link>
              </p>
            </div>
      </Container>
    </Grid>
  );
};

export default Login;
