import { useNavigate, useParams } from "react-router-dom";
import { BiMinus, BiPlus } from "react-icons/all";
import { useEffect, useState } from "react";
import { Checkbox, Label, Radio } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { display, hide } from "../features/loaderSlice";
import helpers from "../util/helper";
import config from "../config";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Swal from "sweetalert2";

export default () => {
  const { timeTableId, routeId, startId, endId, day } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const auth = useSelector((state) => state.auth.value);
  const dispatcher = useDispatch();
  const [totalSeats, setTotalSeat] = useState(0);
  const [carriages, setCarriages] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [ticketUserTypes, setTicketUserTypes] = useState([
    {
      name: "Usual",
      type: "u",
      count: 0,
    },
    {
      name: "Pensioner",
      type: "p",
      count: 0,
    },
    {
      name: "Student",
      type: "s",
      count: 0,
    },
    {
      name: "Youth",
      type: "y",
      count: 0,
    },
    {
      name: "Barn",
      type: "b",
      count: 0,
    },
  ]);
  const navigate = useNavigate();
  const api = "seats";
  const onSubmit = (data) => {
    if (totalSeats > selectedSeats.length) {
      Swal.fire({
        icon: "error",
        title: "Please select position for your selected count ",
      });
      return;
    }

    const { name, email, phone, grade, cancellable } = data;
    let counter = 0;
    const seats = [];
    ticketUserTypes.forEach((tType) => {
      if (tType.count > 0) {
        selectedSeats.slice(counter, counter + tType.count).forEach((s) => {
          counter++;
          seats.push({ seatId: s.id, type: tType.type });
        });
      }
    });
    const reqData = {
      name,
      email,
      phone,
      ticket: {
        day: day,
        startStationId: startId,
        endStationId: endId,
        routeId: routeId,
        timeTableId,
        grade,
        cancellable,
        seats,
      },
    };
    dispatcher(display());
    helpers
      .ajaxRequest(config.BOOK, reqData, (resData) => {
        dispatcher(hide());
        if (auth.isAuthenticated) navigate(`/ticket/${resData.id}`);
        else {
          Swal.fire({
            icon: "success",
            title: "Ticket booked successfully",
            text: "Please check your email for ticket details",
          });
          navigate("/");
        }
      })
      .then(() => {
        dispatcher(hide());
      });
  };

  useEffect(() => {
    dispatcher(display());
    console.log(day);
    helpers
      .ajaxRequest(
        `${config.SEATS}/${timeTableId}/${day}/${startId}/${endId}`,
        {},
        (data) => {
          const chunkSize = 20;
          const carriages = [];
          for (let i = 0; i < data.allSeats.length; i += chunkSize)
            carriages.push(data.allSeats.slice(i, i + chunkSize));
          setCarriages(carriages);
        },
        {},
        () => {},
        "GET"
      )
      .then(() => {
        dispatcher(hide());
      });
  }, [api]);

  const selectSeat = (seat, index, carriageIndex) => {
    if (seat.used) return;
    if (seat.isSelected) {
      setSelectedSeats(
        selectedSeats.filter((sS) => {
          return sS.id !== seat.id;
        })
      );
    } else {
      if (selectedSeats.length < totalSeats) {
        setSelectedSeats([...selectedSeats, { ...seat, index, carriageIndex }]);
      } else return;
    }
    seat.isSelected = !seat.isSelected;
    let newCarriages = [...carriages];
    newCarriages[carriageIndex][index] = seat;
    setCarriages(newCarriages);
  };

  return (
    <div className="flex justify-center  py-8 my-4  text-gray-800 dark:text-white  items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl   py-8 my-4 px-8  flex flex-col  rounded-lg border bg-white dark:bg-gray-800 bg-opacity-25 dark:border-gray-700 dark:bg-opacity-25 "
      >
        <div className="flex flex-col md:flex-row justify-evenly flex-wrap ">
          <div className="py-8 px-8 mt-2  flex rounded-lg border border-gray-200 bg-gray-200 shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col">
            {ticketUserTypes.map((ticketUserType, index) => (
              <div
                key={index}
                className="flex py-1.5 items-center select-none	justify-between "
              >
                <span className="capitalize px-2"> {ticketUserType.name} </span>
                <div className="flex mx-1 items-center">
                  <BiMinus
                    className="hover:cursor-pointer"
                    onClick={() => {
                      setTicketUserTypes(
                        ticketUserTypes.map(
                          (ticketTypeInternal, internalIndex) => {
                            if (
                              index === internalIndex &&
                              ticketTypeInternal.count > 0
                            ) {
                              //let removeSeatsCount =  selectedSeats.length - totalSeats - 1;
                              let newCarriages = [...carriages];
                              let state = false;
                              selectedSeats
                                .slice(totalSeats - 1, selectedSeats.length)
                                .forEach((seat) => {
                                  state = true;
                                  newCarriages[seat.carriageIndex][
                                    seat.index
                                  ].isSelected = false;
                                });
                              if (state) {
                                setSelectedSeats(
                                  selectedSeats.slice(0, totalSeats - 1)
                                );
                                setCarriages(newCarriages);
                              }
                              setTotalSeat(totalSeats - 1);

                              //setCarriages([...originalCarriages]);
                              --ticketTypeInternal.count;
                            }
                            return ticketTypeInternal;
                          }
                        )
                      );
                    }}
                  />
                  <span className="p-1 mx-1 dark:bg-blue-200 bg-blue-700 dark:text-blue-800  text-white rounded">
                    {ticketUserType.count}
                  </span>
                  <BiPlus
                    className="hover:cursor-pointer"
                    onClick={() => {
                      setTicketUserTypes(
                        ticketUserTypes.map(
                          (ticketTypeInternal, internalIndex) => {
                            if (index === internalIndex) {
                              setTotalSeat(totalSeats + 1);
                              ++ticketTypeInternal.count;
                            }
                            return ticketTypeInternal;
                          }
                        )
                      );
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="py-8 px-8 mt-2  flex rounded-lg border border-gray-200 bg-gray-200 shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col justify-evenly space-y-2">
            <div className="flex items-center gap-2">
              <Radio
                id="first-class"
                name="grade"
                value="F"
                defaultChecked={true}
                {...register("grade", {
                  required: true,
                })}
              />
              <Label htmlFor="first-class">First class</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio
                id="second-grade"
                name="grade"
                value="S"
                {...register("grade", {
                  required: true,
                })}
              />
              <Label htmlFor="second-grade">Second grade</Label>
            </div>
            {/*<div className="flex items-center gap-2">*/}
            {/*    <Checkbox {...register("cancellable", {})} id="cancellable"*/}
            {/*              defaultChecked={false}*/}
            {/*    />*/}
            {/*    <Label htmlFor="cancellable">*/}
            {/*        Cancellable ticket 24/h*/}
            {/*    </Label>*/}
            {/*</div>*/}
          </div>

          <div
            className={` ${
              auth.isAuthenticated ? "hidden" : ""
            } py-8 px-8 mt-2  flex rounded-lg border border-gray-200 bg-gray-200 shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col justify-between space-y-3`}
          >
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                {...register("name", {
                  value: auth.user?.name ?? "",
                  required: true,
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Your Name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {" "}
                  Your name should not be empty{" "}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your phone
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                {...register("phone", {
                  pattern: /^[0-9]{10}$/,
                  required: true,
                  value: auth.user?.phone ?? "",
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="xxxxxxxxxx"
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {" "}
                  Your phone is required and should be like 0123456789{" "}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                {...register("email", {
                  required: true,
                  value: auth.user?.email ?? "",
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {" "}
                  Your email is required and should be a valid email{" "}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 w-full flex flex-col rounded-lg border border-gray-200 bg-gray-200 shadow-md dark:border-gray-700 dark:bg-gray-800 relative ">
          <span className="absolute bottom-3  left-2">
            {" "}
            {selectedSeats.length} seats selected from {totalSeats}
          </span>

          <Carousel
            autoFocus={true}
            showThumbs={false}
            showStatus={false}
            useKeyboardArrows
            className="presentation-mode "
          >
            {carriages.map((carriage, i) => (
              <div
                key={"content-" + i}
                className="my-slide content h-52 flex flex-col justify-around py-8 px-2 text-white dark:text-white"
              >
                <div className="flex flex-wrap justify-evenly ">
                  {carriage.slice(0, 10).map((seat, SeatIndex) => (
                    <span
                      key={"seat-" + seat.id}
                      onClick={() => {
                        selectSeat(seat, SeatIndex, i);
                      }}
                      className={`px-2 py-1 hover:cursor-pointer  ${
                        !seat.isSelected || !seat.used
                          ? "bg-green-600 dark:bg-green-900"
                          : ""
                      }  ${
                        seat.isSelected
                          ? "bg-yellow-600 dark:bg-yellow-600"
                          : ""
                      } ${seat.used ? "bg-red-600 dark:bg-red-900" : ""}    `}
                    >
                      {seat.seatNumber}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap justify-evenly ">
                  {carriage.slice(10, 20).map((seat, SeatIndex) => (
                    <span
                      key={"seat-" + seat.id}
                      onClick={() => {
                        selectSeat(seat, SeatIndex + 10, i);
                      }}
                      className={`px-2 py-1 hover:cursor-pointer ${
                        !seat.isSelected || !seat.used
                          ? "bg-green-600 dark:bg-green-900"
                          : ""
                      }  ${
                        seat.isSelected
                          ? "bg-yellow-600 dark:bg-yellow-600"
                          : ""
                      } ${seat.used ? "bg-red-600 dark:bg-red-900" : ""}    `}
                    >
                      {seat.seatNumber}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <button
          type="submit"
          className="w-min mx-auto mt-6 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:cursor-pointer"
        >
          Confirm
        </button>
      </form>
    </div>
  );
};
