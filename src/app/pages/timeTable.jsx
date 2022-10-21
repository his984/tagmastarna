import {Table} from "flowbite-react";
import {useCallback, useEffect, useState} from "react";

import helpers from "../util/helper";
import config from "../config";
import {useDispatch} from "react-redux";
import {display, hide} from "../features/loaderSlice";

export default () => {
    const api = 'timetable' ;
    const [timeTableRows , setTimeTableRows] = useState([]);
    const dispatcher = useDispatch();
    useEffect(() => {
        dispatcher(display())
        helpers.ajaxRequest(config.TIME_TABLE_URL , {} , (data) => {
            setTimeTableRows(data);
        } ,  {} , () => {} , "GET").then(() => {
            dispatcher(hide());
        })
    } , [api])

    return (<div className="flex  flex-col justify-center items-center py-8 my-4">

        <h2 className="mb-4 text-3xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl dark:text-white text-center">
             TimeTable for { (new Date()).toLocaleDateString("sv-SE") }
        </h2>
        <div
            className="max-w-7xl w-full overflow-x-hidden py-8 my-4  px-8  flex flex-col rounded-lg border bg-gray-400 dark:bg-gray-800 bg-opacity-25 dark:border-gray-700 dark:bg-opacity-25">
            <Table hoverable={true} striped={true}>
                <Table.Head>
                    <Table.HeadCell>
                        Start time
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Route name
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Train name
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    { timeTableRows.map((row , index) => (
                        <Table.Row  key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell  className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                { row.startTime }
                            </Table.Cell>
                            <Table.Cell>
                                { row.Route.name }
                            </Table.Cell>
                            <Table.Cell>
                                { row.Train.name }
                            </Table.Cell>
                        </Table.Row>
                    )) }

                </Table.Body>
            </Table>
        </div>

    </div>)
};