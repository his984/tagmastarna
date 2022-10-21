import {Table} from "flowbite-react";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {display, hide} from "../../features/loaderSlice";
import helpers from "../../util/helper";
import config from "../../config";
import {Link, useNavigate} from "react-router-dom";



export default  () => {

    const dispatcher = useDispatch();
    const auth = useSelector((state) => state.auth.value);
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const api = "ticket";
    useEffect(() => {
        if (!auth.isAuthenticated) navigate('/') ;

        dispatcher(display())
        helpers.ajaxRequest(`${config.TICKETS}`, {}, (data) => {
            console.log(data)
            setTickets(data)
        }, {token: auth.user.token}, () => {
        }, "GET").then(() => {
            dispatcher(hide());
        })

    }, [api])

    return (<div className="flex justify-center items-center py-8 my-4 flex-col">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl dark:text-white text-center">
            Tickets
        </h2>
    <div className="max-w-7xl overflow-x-hidden py-8 my-4  px-8  flex flex-col rounded-lg border bg-gray-400 dark:bg-gray-800 bg-opacity-25 dark:border-gray-700 dark:bg-opacity-25">
        <Table hoverable={true} striped={true}>
            <Table.Head>
                <Table.HeadCell>
                    ID
                </Table.HeadCell>
                <Table.HeadCell>
                    Price
                </Table.HeadCell>
                <Table.HeadCell>
                    start station
                </Table.HeadCell>
                <Table.HeadCell>
                    end station
                </Table.HeadCell>
                <Table.HeadCell>
      <span className="sr-only">
        Options
      </span>
                </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
                {
                    tickets.map((ticket) => (
                        <Table.Row key={ticket.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {ticket.id}
                            </Table.Cell>
                            <Table.Cell>
                                {ticket.price}
                            </Table.Cell>
                            <Table.Cell>
                                {ticket.startStation.name}
                            </Table.Cell>
                            <Table.Cell>
                                {ticket.endStation.name}
                            </Table.Cell>
                            <Table.Cell>
                                <Link
                                    to={"/ticket/" + ticket.id}
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                >
                                    Show
                                </Link>
                                { ticket.cancelable ?
                                // <a href="#">
                                // </a>
                                    " "
                                    : ""}
                            </Table.Cell>
                        </Table.Row>
                    ))
                }

            </Table.Body>
        </Table>
    </div>

</div>)};