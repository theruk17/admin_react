import { BrowserRouter, Route, Routes } from "react-router-dom";
import ShowData from "../Pages/ShowData";
import Upload_data from "../Pages/Upload_data";

function AppRoutes() {
    return (
            <Routes>
                <Route path="/" element={<ShowData />}></Route>
                <Route path="/upload" element={<Upload_data />}></Route>
            </Routes> 
    )
}
export default AppRoutes;