import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/operations/SettingsAPI"
import ConfirmationModal from "../../../common/ConfirmationModal"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useState } from "react"

export default function DeleteAccount() {
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmaationModal, setConfirmationModal] = useState(null);

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }
  return (
    <div className="my-4 md:my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-4 md:p-8">
      <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
        <FiTrash2 className="text-3xl text-pink-200" />
      </div>
      <div className="flex flex-col space-y-2">
        <h2 className="text-lg font-semibold text-richblack-5">Delete Account</h2>
        <div className="w-3/5 text-pink-25">
          <p>Would you like to delete account?</p>
          <p>
            This account may contain Paid Courses. Deleting your account is
            permanent and will remove all the content associated with it.
          </p>
        </div>
        <button
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Do you Want to Delete this Course",
                        tex2: "All the data related to this course will be deleted",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleDeleteAccount()
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      })
                    }
                    title="Delete"
                    className="w-fit cursor-pointer italic text-pink-300"
                  >
                   I want to delete my account.
                  </button>
      </div>
      {confirmaationModal && (
        <ConfirmationModal modalData={confirmaationModal} />
      )}
    </div>
  );
}
