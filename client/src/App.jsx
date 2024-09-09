import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Category from "./pages/Category";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Article from "./pages/components/StandardPost";
import Styles from "./pages/Styles";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route exact path="/category" element={<Category />} />
        <Route exact path="/category/article" element={<Article />} />
        <Route exact path="/blogs" element={<Blogs />} />
        <Route exact path="/blogs/article" element={<Article />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/styles" element={<Styles />} />
      </Routes>
    </Router>
  );
}

export default App;
