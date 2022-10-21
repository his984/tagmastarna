const SERVER_BASE = 'http://localhost:3001/api';
const config = {
    LOGIN_URL: SERVER_BASE + '/auth/login',
    SIGN_UP_URL: SERVER_BASE + '/auth/signup',
    LOGOUT_URL: SERVER_BASE + '/auth/logout',
    LOGIN_BY_TOKEN: SERVER_BASE + '/auth/login-by-token',
    CONTACT_US_URL: SERVER_BASE + '/contact-us',
    TIME_TABLE_URL: SERVER_BASE + '/timetable',
    STATIONS: SERVER_BASE + '/stations',
    ROUTES: SERVER_BASE + '/routes',
    SEATS: SERVER_BASE + '/seats',
    BOOK: SERVER_BASE + '/book',
    TICKET: SERVER_BASE + '/user/get-ticket',
    TICKETS: SERVER_BASE + '/user/tickets',
    PROFILE: SERVER_BASE + '/user/profile',
}

export default config;