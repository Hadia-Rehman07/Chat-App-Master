import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
// Is import ki ab yahan zaroorat nahi agar aap use nahi kar rahe
// import ThemeToggle from "./components/ThemeToggle"; 
import AdminDashboard from "./Pages/AdminDashboard";

function App() {
  return (
    <div className="App">
      {/* <ThemeToggle />  <-- Ye line yahan se remove kar di hai */}
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} />
      <Route path="/admin" component={AdminDashboard} />
    </div>
  );
}

export default App;