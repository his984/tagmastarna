import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {display, hide} from "../../features/loaderSlice";
import helpers from "../../util/helper";
import config from "../../config";
import {update} from "../../features/authSlice";
import Swal from "sweetalert2";
import Logo from "../../favicon.svg";
import {useEffect} from "react";

export default () => {

    const {register, handleSubmit, formState: {errors}, getValues} = useForm();
    const dispatcher = useDispatch();
    const auth = useSelector((state) => state.auth.value);
    const navigate = useNavigate();
    const state = "profile" ;
    useEffect(() => {
        if (!auth.isAuthenticated) navigate('/') ;
    } , [state])

    const onSubmit = data => {
       dispatcher(display())
        helpers.ajaxRequest(config.PROFILE, data, (resData) => {
            dispatcher(update(resData))
            Swal.fire({
                icon: 'success',
                title: 'updated successfully',
            });
        }).then(() => {
            dispatcher(hide())
        });
    };





    return (<section className="bg-gray-50 dark:bg-gray-900 py-8 my-4">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0">
            <div
                className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Profile
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                        <div>
                            <label htmlFor="name"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                name</label>
                            <input type="text" name="name" id="name" {...register("name", {
                                required: true,
                                value: auth.user.name
                            })}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="Hisham Ali" required=""/>
                            {errors.name &&
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500"> Your name is required </p>}
                        </div>
                        <div>
                            <label htmlFor="phone"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                phone</label>
                            <input type="text" name="phone" id="phone"
                                   {...register("phone", {
                                       pattern: /^\+46\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{4}$/,
                                       value: auth.user.phone,
                                       required: true
                                   })}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="+46 XX XXX XXXX"/>
                            {errors.phone &&
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500"> Your phone is required and
                                    should be like +46121231234 </p>}
                        </div>
                        <div>
                            <label htmlFor="email"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                email</label>
                            <input type="email" name="email" id="email"
                                   {...register("email", {required: true, value: auth.user.email})}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="name@company.com"/>
                            {errors.email &&
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500"> Your email is required and
                                    should be a valid email </p>}
                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" id="password"
                                   {...register("password", {minLength: 8})}
                                   placeholder="••••••••"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   required=""/>
                            {errors.password &&
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500"> password length should be >=
                                    8 </p>}
                        </div>
                        <div>
                            <label htmlFor="confirm_password"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm
                                Password</label>
                            <input type="password" name="confirm_password" id="confirm_password"
                                   {...register("passwordConfirmation", {
                                       validate: {
                                           passwordsMustBeMatched: value => getValues().password === value
                                       }
                                   })}
                                   placeholder="••••••••"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   required=""/>
                            {errors.passwordConfirmation &&
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500"> confirm password should
                                    equals password above </p>}

                        </div>
                        <button type="submit"
                                className="w-full  mt-3 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:cursor-pointer"> Save
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>)
};