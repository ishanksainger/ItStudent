import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { BuyCourse } from "../../../../services/operations/studentFeaturesApi"
import IconBtn from "../../../common/IconBtn"

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleBuyCourse = () => {
    const courses = cart.map((course) => course._id)
    BuyCourse(token, courses, user, navigate, dispatch)
  }

  return (
    <div className="min-w-[100px] sm:w-fit rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 md:p-6 sm:mt-4">
    <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
    <p className="mb-4 md:mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
    <IconBtn
      text="Buy Now"
      onClick={handleBuyCourse}
      customClasses="w-full justify-center"
    />
  </div>
  )
}
