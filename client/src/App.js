import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyDataTable from './components/dataTable/dataTable';
import Report from './components/report/report';
import NavBar from './components/home/navbar';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
      <Route path="/" element={<Report />} />
        <Route path="/table" element={<MyDataTable />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
