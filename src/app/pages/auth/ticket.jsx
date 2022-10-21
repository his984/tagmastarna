import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { display, hide } from "../../features/loaderSlice";
import helpers from "../../util/helper";
import config from "../../config";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "qrcode";

export default () => {
  const { ticketId } = useParams();
  const dispatcher = useDispatch();
  const auth = useSelector((state) => state.auth.value);
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({});
  const [qr, setQr] = useState("");
  const api = "ticket";

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/");

    dispatcher(display());
    helpers
      .ajaxRequest(
        `${config.TICKET}/${ticketId}`,
        {},
        (data) => {
          setTicket(data);
          console.log(data);
          QRCode.toDataURL(JSON.stringify(data), {
            width: 256,
          }).then((url) => {
            setQr(url);
          });
        },
        { token: auth.user.token },
        () => {},
        "GET"
      )
      .then(() => {
        dispatcher(hide());
      });
  }, [api]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-8 my-4 overflow-x-hidden ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0 overflow-x-hidden">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 overflow-x-hidden">
          {ticket.id ? (
            <div className="flex flex-col p-6 space-y-4 md:space-y-6 sm:p-8 items-center">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Ticket booking
              </h1>

              {qr ? <img className={"h-64 w-64 "} src={qr} alt="qr" /> : ""}
              <h3 className="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                Ticket : {ticketId}
              </h3>
              <h3 className="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                From : {ticket.startStation.name} &nbsp;
                &nbsp;,&nbsp;&nbsp;&nbsp; To : {ticket.endStation.name}
              </h3>

              <h3 className="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                Train : {ticket.Train.name}
              </h3>
              <h3 className="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                {ticket.TicketSeats.map((ticketSeat) => {
                  return (
                    <span>
                      {" "}
                      Carriage : {ticketSeat.Seat.Carriage.carriageNumber}, Seat
                      : {ticketSeat.Seat.seatNumber} <br />{" "}
                    </span>
                  );
                })}
              </h3>

              <h3 className="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                Start Platform : {ticket.startPlatform} &nbsp;
                &nbsp;,&nbsp;&nbsp;&nbsp; End Platform : {ticket.endPlatform}
              </h3>
              <h3 className="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                Departure Time : {ticket.departureTime}
              </h3>
              <h3 className="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                Arrival Time : {ticket.arrivalTime}
              </h3>

              <h3 className="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                Price : {ticket.price} kr
              </h3>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </section>
  );
};
