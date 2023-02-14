import { BrowserRouter, Route, Routes } from "react-router-dom";
import MonitorData from "../Pages/MonitorData";
import Upload_data from "../Pages/Upload_data";
import CaseData from "../Pages/CaseData";
import NbData from "../Pages/NbData";
import Upload_data_case from "../Pages/Upload_data_case";
import Upload_nb from "../Pages/Upload_nb";

function AppRoutes() {
    return (
            <Routes>
                <Route path="/" element={<MonitorData />}></Route>
                <Route path="/upload_nmt" element={<Upload_data />}></Route>
                <Route path="/monitor" element={<MonitorData />}></Route>
                <Route path="/case" element={<CaseData />}></Route>
                <Route path="/nb" element={<NbData />}></Route>
                <Route path="/upload_case" element={<Upload_data_case />}></Route>
                <Route path="/upload_nb" element={<Upload_nb />}></Route>
            </Routes> 
    )
}
export default AppRoutes;