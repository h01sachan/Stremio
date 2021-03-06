import React from "react";
import Sidebar from "react-sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBars,
  faHome,
  faChartLine,
  faVideo,
  faHistory,
  faThumbsUp,
  faToggleOn,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Navbar, Form, Button, FormControl, InputGroup } from "react-bootstrap";
import classes from "./Navigation.css";
import { Link, Redirect } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import { Home } from "@material-ui/icons";

class SideBar extends React.Component {
  state = {
    sidebarDocked: true,
    sidebarOpen: false,
    input: {
      keyword: "",
    },
  };

  componentDidMount() {
    if (window.matchMedia("(max-width: 768px)").matches) {
      this.setState({ sidebarDocked: false });
    } else this.setState({ sidebarDocked: true });
  }

  onSetSidebarOpen = () => {
    let open = !this.state.sidebarOpen;
    this.setState({ sidebarOpen: open });
  };

  searchHandler = (event) => {
    let input = this.state.input;
    input[event.target.name] = event.target.value;

    this.setState({
      input,
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  render() {
    let token = localStorage.getItem("token");
    let Auth = false;
    if (token != null) {
      if (token !== "undefined") {
        Auth = true;
      }
    }

    let Nav = null;

    if (Auth) {
      Nav = (
        <Navbar className={classes.Navbar} sticky="top">
          <span className={classes.burgericon}>
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => this.onSetSidebarOpen()}
              className={classes.hamburger}
            />{" "}
          </span>

          <Navbar.Brand as={Link} to="/" className={classes.sidelogo}>
            STREMIO
          </Navbar.Brand>
          <Form inline onSubmit={this.submitHandler}>
            <InputGroup className={classes.InputGroup}>
              <FormControl
                type="text"
                placeholder="Search"
                className={classes.Search}
                onChange={this.searchHandler}
                name="keyword"
              />
              <InputGroup.Append>
                <Button
                  variant="null"
                  as={Link}
                  to={"/search/" + this.state.input.keyword}
                  className={classes.SearchIcon}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
          <Navbar.Collapse className="justify-content-end">
            <Link to="/myprofile">
              <Avatar
                src={localStorage.getItem("profilepic")}
                className={classes.profile}
              />
            </Link>

            <Button
              variant="null"
              as={Link}
              to="/"
              onClick={() => localStorage.clear()}
              className={classes.logoutbutton}
            >
              Logout
            </Button>
          </Navbar.Collapse>
        </Navbar>
      );
    } else {
      Nav = (
        <Navbar className={classes.Navbar} sticky="top">
          <span className={classes.burgericon}>
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => this.onSetSidebarOpen()}
              className={classes.hamburger}
            />{" "}
          </span>

          <Navbar.Brand as={Link} to="/" className={classes.sidelogo}>
            STREMIO
          </Navbar.Brand>
          <Form inline onSubmit={this.submitHandler}>
            <InputGroup className={classes.InputGroup}>
              <FormControl
                type="text"
                placeholder="Search"
                className={classes.Search}
                name="keyword"
                onChange={this.searchHandler}
              />

              <InputGroup.Append>
                <Button
                  variant="null"
                  as={Link}
                  to={"/search/" + this.state.input.keyword}
                  className={classes.SearchIcon}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
          <Navbar.Collapse className="justify-content-end">
            <Button
              variant="null"
              as={Link}
              to="/login"
              className={classes.loginButton}
            >
              Login
            </Button>
            <Button
              variant="null"
              as={Link}
              to="/signup"
              className={classes.signupButton}
            >
              Sign Up
            </Button>
          </Navbar.Collapse>
        </Navbar>
      );
    }

    return (
      <React.Fragment>
        <Sidebar
          sidebar={
            <React.Fragment>
              <div className={classes.sidebarlogo}>
                {" "}
                <Link to="/" className={classes.link}>
                  {" "}
                  STREMIO{" "}
                </Link>{" "}
              </div>
              <div className={classes.sidebarContent}>
                <nav>
                  <Link to="/" className={classes.link}>
                    <div
                      className={
                        this.props.active === "home"
                          ? classes.activelink
                          : classes.sidelink
                      }
                    >
                      <FontAwesomeIcon icon={faHome} />{" "}
                      <span style={{ paddingLeft: "1rem" }}> Home </span>
                    </div>
                  </Link>
                  <Link to="/trending" className={classes.link}>
                    <div
                      className={
                        this.props.active === "trending"
                          ? classes.activelink
                          : classes.sidelink
                      }
                    >
                      <FontAwesomeIcon icon={faChartLine} />{" "}
                      <span style={{ paddingLeft: "1rem" }}> Trending </span>
                    </div>
                  </Link>
                  <Link to="/subscribed" className={classes.link}>
                    <div
                      className={
                        this.props.active === "subscribed"
                          ? classes.activelink
                          : classes.sidelink
                      }
                      onClick={() => this.setState({ active: "subscribed" })}
                    >
                      <FontAwesomeIcon icon={faToggleOn} />{" "}
                      <span style={{ paddingLeft: "1rem" }}> Subscribed </span>
                    </div>
                  </Link>
                  <Link to="/history" className={classes.link}>
                    <div
                      className={
                        this.props.active === "history"
                          ? classes.activelink
                          : classes.sidelink
                      }
                      onClick={() => this.setState({ active: "history" })}
                    >
                      <FontAwesomeIcon icon={faHistory} />{" "}
                      <span style={{ paddingLeft: "1rem" }}> History </span>
                    </div>
                  </Link>
                  <Link to="/likedvideos" className={classes.link}>
                    <div
                      className={
                        this.props.active === "likedvideos"
                          ? classes.activelink
                          : classes.sidelink
                      }
                      onClick={() => this.setState({ active: "likedvideos" })}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} />{" "}
                      <span style={{ paddingLeft: "1rem" }}>
                        {" "}
                        Liked Videos{" "}
                      </span>
                    </div>
                  </Link>
                  <Link to="/watchlater" className={classes.link}>
                    <div
                      className={
                        this.props.active === "watchlater"
                          ? classes.activelink
                          : classes.sidelink
                      }
                      onClick={() => this.setState({ active: "watchlater" })}
                    >
                      <FontAwesomeIcon icon={faClock} />{" "}
                      <span style={{ paddingLeft: "1rem" }}> Watch Later </span>
                    </div>
                  </Link>
                  <Link to="/yourvideos" className={classes.link}>
                    <div
                      className={
                        this.props.active === "yourvideos"
                          ? classes.activelink
                          : classes.sidelink
                      }
                      onClick={() => this.setState({ active: "yourvideos" })}
                    >
                      <FontAwesomeIcon icon={faVideo} />{" "}
                      <span style={{ paddingLeft: "1rem" }}> Your Videos </span>
                    </div>
                  </Link>
                </nav>
              </div>
            </React.Fragment>
          }
          sidebarClassName={classes.sidebar}
          open={this.state.sidebarOpen}
          docked={this.state.sidebarDocked}
          onSetOpen={this.onSetSidebarOpen}
        >
          {Nav}
          {this.props.children}
        </Sidebar>
      </React.Fragment>
    );
  }
}

export default SideBar;
