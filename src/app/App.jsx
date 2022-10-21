import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navigation from "./components/Navigation";
import Home from "./pages/home";
import {Flowbite} from "flowbite-react";
import Footer from "./components/footer";
import Contact_us from "./pages/contact_us";
import Login from "./pages/login";
import Register from "./pages/register";
import TimeTable from "./pages/timeTable";
import Booking from "./pages/booking";
import Profile from "./pages/auth/profile";
import Tickets from "./pages/auth/tickets";
import {useDispatch, useSelector} from 'react-redux'
import ReactLoading from 'react-loading';
import {useEffect} from "react";
import {set, hide} from "./features/loaderSlice";
import helpers from "./util/helper";
import config from "./config";
import {afterAuth} from "./features/authSlice";
import Ticket from "./pages/auth/ticket";

function App() {
    const dispatcher = useDispatch();
    const loading = useSelector((state) => state.loader.value)
    const auth = useSelector((state) => state.auth.value);
    const api = "app";
    useEffect(() => {
        dispatcher(set(!auth.isAuthenticated))
        if (auth.user.token) {
            helpers.ajaxRequest(config.LOGIN_BY_TOKEN, {}, (user) => {
                dispatcher(afterAuth(user))
            }, {token: auth.user.token}, (res) => {
                localStorage.setItem("token" , null );
            }, "POST", false).then(() => {
                dispatcher(hide())
            })
        } else dispatcher(hide())
    }, [api]);
    return (<Router>

        {/* Here for light and dark mode  */}
        <Flowbite>
            <div
                className="w-screen min-h-screen  flex flex-col bg-white dark:bg-gray-900 justify-between bg-gray-50 dark:bg-gray-900">
                <header className="border-b   border-gray-200 py-2 bg-white dark:bg-gray-800">
                    <Navigation/>
                </header>
                <div className="h-full relative overflow-x-hidden">
                    <div
                        className={loading ? "flex justify-center items-center dark:text-gray-300  text-gray-800 fixed top-0 left-0 h-full w-full " : "hidden"}>
                        <ReactLoading type="spinningBubbles" color="currentColor" height="15rem" width="15rem"/>
                    </div>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/contact-us" element={<Contact_us/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/time-table" element={<TimeTable/>}/>
                        <Route path="/booking/:timeTableId/:routeId/:startId/:endId/:day" element={<Booking/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/tickets" element={<Tickets/>}/>
                        <Route path="/ticket/:ticketId" element={<Ticket/>}/>
                    </Routes>
                </div>
                <div className="border-t border-gray-200">
                    <Footer></Footer>
                </div>
            </div>

        </Flowbite>
    </Router>);
}

export default App;
