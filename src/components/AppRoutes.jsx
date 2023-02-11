import { BrowserRouter, Route, Routes } from "react-router-dom";
import MonitorData from "../Pages/MonitorData";
import Upload_data from "../Pages/Upload_data";
import CaseData from "../Pages/CaseData";
import Upload_data_case from "../Pages/Upload_data_case";

function AppRoutes() {
    return (
            <Routes>
                <Route path="/" element={<MonitorData />}></Route>
                <Route path="/upload_nmt" element={<Upload_data />}></Route>
                <Route path="/monitor" element={<MonitorData />}></Route>
                <Route path="/case" element={<CaseData />}></Route>
                <Route path="/upload_case" element={<Upload_data_case />}></Route>
            </Routes> 
    )
}
export default AppRoutes;