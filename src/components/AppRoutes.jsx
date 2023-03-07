import { BrowserRouter, Route, Routes } from "react-router-dom";
import MonitorData from "../Pages/MonitorData";
import Upload_data from "../Pages/Upload_data";
import CaseData from "../Pages/CaseData";
import NbData from "../Pages/NbData";
import LcData from "../Pages/LcData";

function AppRoutes() {
    return (
            <Routes>
                <Route path="/" element={<MonitorData />}></Route>
                <Route path="/upload" element={<Upload_data />}></Route>
                <Route path="/monitor" element={<MonitorData />}></Route>
                <Route path="/case" element={<CaseData />}></Route>
                <Route path="/nb" element={<NbData />}></Route>
                <Route path="/lc" element={<LcData />}></Route>
            </Routes> 
    )
}
export default AppRoutes;