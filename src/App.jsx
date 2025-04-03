import "./App.css";
import { ToastContainer } from "react-toastify";
import Navigation from "./pages/Auth/Navigation";
import { Outlet, Router} from "react-router-dom";
import Slider from "./components/Slider";
import CommonRoutes from "./routes/CommonRoutes";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <Navigation />
      <CommonRoutes />
      <Footer />
    </>
  );
}

export default App;
