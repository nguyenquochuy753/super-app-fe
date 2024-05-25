import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./page/Home/Home";
import Login from "./page/Login/Login";
import Layout from "./template/Layout";
import InfoMovie from "./page/InfoMovie/InfoMovie";
import Register from "./page/Register/Register";
import BookTicket from "./page/BookTicket/BookTicket";
import Loading from "./components/Loading";
import UserInfo from "./page/UserInfo/UserInfo";
import PageNotFound from "./page/Page_404/PageNotFound";
import "moment/locale/vi";
import PageSuccess from "./page/Success/pageSuccess";

const userRoutes = [
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/detail/:id",
    element: (
      <Layout>
        <InfoMovie />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: "/register",
    element: (
      <Layout>
        <Register />
      </Layout>
    ),
  },
  {
    path: "/ticketroom/:id",
    element: (
      <Layout>
        <BookTicket />
      </Layout>
    ),
  },
  {
    path: "/profile",
    element: (
      <Layout>
        <UserInfo />
      </Layout>
    ),
  },
  {
    path: "/success/:id",
    element: (
      <Layout>
        <PageSuccess />
      </Layout>
    ),
  },
  { path: "*", element: <PageNotFound /> },
];

function App() {
  return (
    <div>
      <Loading />
      <BrowserRouter>
        <Routes>
          {userRoutes.map((route, index) => {
            return (
              <Route key={index} path={route.path} element={route.element} />
            );
          })}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
