import {Button, Label, Textarea, TextInput} from "flowbite-react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {display, hide} from "../features/loaderSlice";
import helpers from "../util/helper";
import config from "../config";
import Swal from "sweetalert2";

export default () => {

    const {register, handleSubmit, formState: {errors}} = useForm();
    const dispatcher = useDispatch();
    const navigate = useNavigate();
    const onSubmit = data => {
        dispatcher(display())
        helpers.ajaxRequest(config.CONTACT_US_URL, data, (resData) => {
            Swal.fire({
                icon: 'success',
                title: 'Your Message sent successfully',
                text: "Redirect to home",
            }).then(() => {
                navigate('/')
            })
        }).then(() => {
            dispatcher(hide())
        });
    };

    return (<div className="flex justify-center  py-8 my-4  items-center">
        <div
            className="w-full max-w-4xl   py-8 my-4 px-8  flex flex-col rounded-lg border bg-gray-400 dark:bg-gray-800 bg-opacity-25 dark:border-gray-700 dark:bg-opacity-25 ">

            <form onSubmit={handleSubmit(onSubmit)}
                  className="py-8 px-8  flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col">
                <div className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="name"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                            name</label>
                        <input type="text" name="name" id="name" {...register("name", {required: true})}
                               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="Hisham Ali" required=""/>
                        {errors.name &&
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500"> Your name is required </p>}
                    </div>
                    <div>
                        <label htmlFor="email"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                            email</label>
                        <input type="email" name="email" id="email"
                               {...register("email", {required: true})}
                               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="name@company.com"/>
                        {errors.email &&
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500"> Your email is required and
                                should be a valid email </p>}
                    </div>
                    <div id="textarea">
                        <div className="mb-2 block">
                            <Label
                                htmlFor="message"
                                value="Your message"
                            />
                        </div>
                        <Textarea
                            id="message"
                            placeholder="Enter Your Message"
                            required={true}
                            rows={4}
                            {...register('content', {minLength: 10})}
                        />
                        {errors.content &&
                            <p className="mt-2 text-sm text-red-600 dark:text-red-500"> Your message length should be >=
                                10 </p>}
                    </div>
                    <div className="ml-auto">
                        <Button type="submit">
                            Send
                        </Button>
                    </div>

                </div>
            </form>

        </div>
    </div>)
};