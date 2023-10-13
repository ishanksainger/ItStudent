import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";

import logo from "../../assets/Logo/Niki Logo/Mask group.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track the menu open state

  const fetchSubLinks = async () => {
    setLoading(true);
    try {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      setSubLinks(res.data.data);
    } catch (error) {
      console.log("Could Not fetch the category list");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubLinks();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${location.pathname !== "/" ? "bg-richblack-800" : ""} transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to="/">
          <img src={logo} alt="Logo"  loading="lazy" className=" w-[110px] sm:w-[160px] sm:h-[32px]" />
        </Link>

        {/* Mobile Menu Icon */}
        <div className="flex">
          <button
            className=' mr-1 md:hidden'
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle the menu when the button is clicked
          >
            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
          </button>
          {/* Show Login and Signup buttons on mobile screens when user is logged out */}
          <div className="flex items-center gap-x-2 sm:gap-x-4 md:hidden">
          <div className="flex gap-x-3 items-center">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token !== null && <div className="md:hidden relative flex items-center">
            <ProfileDropdown />
            </div>}
            </div>
            {token === null && (
              <Link to="/login">
                <button className="rounded-[8px]  border border-richblack-700 bg-richblack-800 px-[8px] py-[4px] sm:px-[12px] sm:py-[8px] text-richblack-100">
                  Log in
                </button>
              </Link>
            )}
            {token === null && (
              <Link to="/signup">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[8px] py-[4px] sm:px-[12px] sm:py-[8px] text-richblack-100">
                  Sign up
                </button>
              </Link>
            )}
          </div>
          

        </div>
        {/* Navigation links for small screens */}
        {isMenuOpen && (
          <div
            className={`md:hidden fixed z-10 top-14 left-0 right-0 bg-richblack-800 py-2 transform ${isMenuOpen ? 'mobile-menu-animation' : ''} transition-transform duration-300`}
            onClick={closeMenu}
            onMouseLeave={closeMenu}
          >

            <ul className="flex flex-col items-center gap-4">
              {NavbarLinks.map((link, index) => (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 text-richblack-25`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] 
                      flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg 
                      bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all 
                      duration-150 lg:w-[300px] group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100"
                        onMouseLeave={closeMenu}>

                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] 
                        translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks
                              ?.filter((subLink) => subLink?.course?.length > 0)
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={link?.path}>
                      <p className="text-richblack-25">{link.title}</p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation links for larger screens */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-25"}`}
                  >
                    <p>{link.title}</p>
                    <BsChevronDown />
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] 
                    translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all 
                    duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : subLinks.length ? (
                        <>
                          {subLinks
                            ?.filter((subLink) => subLink?.course?.length > 0)
                            ?.map((subLink, i) => (
                              <Link
                                to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                key={i}
                              >
                                <p>{subLink.name}</p>
                              </Link>
                            ))}
                        </>
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login / Signup / Dashboard / Profile Dropdown for larger screens */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
