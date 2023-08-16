import { BrowserRouter, Route, Routes } from "react-router-dom";
import MonitorData from "../Pages/MonitorData";
import Upload_data from "../Pages/Upload_data";
import CaseData from "../Pages/CaseData";
import NbData from "../Pages/NbData";
import LcData from "../Pages/LcData";
import FanData from "../Pages/FanData";
import HSData from "../Pages/HSData";
import KBData from "../Pages/KBData";
import KCapData from "../Pages/KeyCapData";
import CHData from "../Pages/CHData";
import MouseData from "../Pages/MouseData";
import MousePadData from "../Pages/MousePadData";
import MICData from "../Pages/MICData";
import SinkData from "../Pages/SinkData";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MonitorData />}></Route>
            <Route path="/upload" element={<Upload_data />}></Route>
            <Route path="/monitor" element={<MonitorData />}></Route>
            <Route path="/case" element={<CaseData />}></Route>
            <Route path="/nb" element={<NbData />}></Route>
            <Route path="/lc" element={<LcData />}></Route>
            <Route path="/fan" element={<FanData />}></Route>
            <Route path="/headset" element={<HSData />}></Route>
            <Route path="/kb" element={<KBData />}></Route>
            <Route path="/kcap" element={<KCapData />}></Route>
            <Route path="/ch" element={<CHData />}></Route>
            <Route path="/mouse" element={<MouseData />}></Route>
            <Route path="/mousepad" element={<MousePadData />}></Route>
            <Route path="/mic" element={<MICData />}></Route>
            <Route path="/sink" element={<SinkData />}></Route>
        </Routes>
    )
}
export default AppRoutes;