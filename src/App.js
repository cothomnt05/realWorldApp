import "./App.css";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Home from "./Components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Setting from "./Components/Setting";
import Article from "./Components/Article";
import Profile from "./Components/Profile";
import Auth from "./Components/Auth";
import ArticleCE from "./Components/ArticleCE";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" exact element={<Home />}></Route>
          <Route path="/Setting" element={<Setting />}></Route>
          <Route path="/Editor" element={<ArticleCE />}></Route>
          <Route
            path="/Editor/:slug"
            element={<ArticleCE isEditorScreen />}
          ></Route>
          <Route path="/Login" element={<Auth isLoginScreen />}></Route>
          <Route path="/Register" element={<Auth />}></Route>
          <Route path="/profiles/:slug" element={<Profile />}></Route>
          <Route path="/article/:slug" element={<Article />}></Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
