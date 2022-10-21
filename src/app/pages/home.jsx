import { Label, TextInput, Button, Select } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { display, hide } from "../features/loaderSlice";
import helpers from "../util/helper";
import config from "../config";
import { useDispatch } from "react-redux";
import date from "date-and-time";
import { Link } from "react-router-dom";

export default () => {
  const dispatcher = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const [stations, setStations] = useState([]);
  const [startStationId, setStartStationId] = useState(-1);
  const now = new Date().toLocaleDateString("en-US");
  const [search, setSearch] = useState({
    timeTable: [],
    route: [],
  });

  /*

    .filter((timetable) => {
                            return timetable.initDate.getTime() > Date.now() + (2 * 60 * 1000)
                        })

     */
  const onSubmit = (data) => {
    reset(data, { keepDirty: true });
    dispatcher(display());
    helpers
      .ajaxRequest(
        `${config.ROUTES}/${data.from}/${data.to}`,
        {},
        (dataRes) => {
          console.log(dataRes);
          if (dataRes.message) {
          } else setSearch(dataRes);
        },
        {},
        (test) => {
          console.log(test);
        },
        "GET"
      )
      .then((r) => {
        dispatcher(hide());
      });
  };

  const api = "app";
  useEffect(() => {
    dispatcher(display());
    helpers
      .ajaxRequest(
        config.STATIONS,
        {},
        (data) => {
          setStations(data);
          setStartStationId(data[0].id);
        },
        {},
        () => {},
        "GET"
      )
      .then((r) => {
        dispatcher(hide());
      });
  }, [api]);

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-7xl  min-w-md overflow-x-hidden py-8 my-4 px-8  flex flex-col rounded-lg border bg-gray-400 dark:bg-gray-800 bg-opacity-25 dark:border-gray-700 dark:bg-opacity-25 ">
        <div className="py-8 px-8  flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              <div className="mb-2 block">
                <div id="startStation">
                  <div className="mb-2 block">
                    <Label htmlFor="start" value="From : " />
                  </div>
                  <Select
                    id="start"
                    {...register("from", {
                      required: "Please select Start station",
                    })}
                    value={startStationId}
                    onChange={(event) => {
                      setStartStationId(event.target.value);
                    }}
                  >
                    {stations.map((station, index) => (
                      <option key={station.id} value={station.id}>
                        {station.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <div id="endStation">
                  <div className="mb-2 block">
                    <Label htmlFor="end" value="To : " />
                  </div>
                  <Select
                    id="end"
                    {...register("to", {
                      required: "Please select destination",
                    })}
                  >
                    {stations.map((station) => (
                      <option
                        key={station.id * 2}
                        value={station.id}
                        disabled={station.id == startStationId}
                      >
                        {station.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            <div className="ml-auto">
              <Button type="submit">Search</Button>
            </div>
          </form>
        </div>
        <div className="py-8 px-8 mt-2  flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col">
          <ul className="space-y-4 list-disc list-inside text-gray-500 dark:text-gray-400">
            {search.timeTable
              .map((timetable) => {
                let initDate = date.parse(
                  now + " " + timetable.startTime + " +0200",
                  "MM/DD/Y HH:mm:ss Z"
                );
                console.log(initDate.getTime());
                if (initDate.getTime() > Date.now() + 2 * 60 * 1000) {
                  initDate = date.addDays(initDate, 1);
                }
                const formatedDay = initDate
                  .toLocaleDateString("en-US")
                  .split("/");
                formatedDay.unshift(formatedDay.pop());

                return {
                  ...timetable,
                  initDate,
                  formatedDay: formatedDay.join("-"),
                };
              })
              .map((timetable) => {
                return (
                  <li key={timetable.id} className="p-2 flex flex-col">
                    {timetable.formatedDay +
                      "  : " +
                      search.route[0].Station.name +
                      "  -   " +
                      search.route[search.route.length - 1].Station.name}
                    <ol className="pl-5 py-2 mt-2 space-y-1 list-decimal list-inside">
                      {search.route.map((station) => {
                        return (
                          <li key={station.platform} className="py-1">
                            {`${station.Station.name} , platform : ${
                              station.platform
                            }, arrival : ${date
                              .addMinutes(timetable.initDate, station.arrival)
                              .toLocaleTimeString()}`}{" "}
                          </li>
                        );
                      })}
                    </ol>
                    <Link
                      to={`/booking/${timetable.id}/${timetable.RouteId}/${
                        search.route[0].Station.id
                      }/${search.route[search.route.length - 1].Station.id}/${
                        timetable.formatedDay
                      }`}
                      className="my-2 mx-auto"
                    >
                      <Button>Book</Button>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};
