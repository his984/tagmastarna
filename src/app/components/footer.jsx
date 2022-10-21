import { Footer } from "flowbite-react";

export default () => (
  <footer className="p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
      © 2022{" "}
      <a href="/" className="hover:underline">
        Tågmästarna
      </a>
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
      <li>
        <a href="/" className="mr-4 hover:underline md:mr-6 ">
          Home
        </a>
      </li>
      <li>
        <a href="/time-table" className="mr-4 hover:underline md:mr-6">
          TimeTable
        </a>
      </li>
      <li>
        <a href="/contact-us" className="mr-4 hover:underline md:mr-6">
          Contact us
        </a>
      </li>
    </ul>
  </footer>
);
