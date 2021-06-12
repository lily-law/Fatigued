import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  authUserAsync,
  closeLoginMenu,
  logoutUserAsync,
  selectAuthNetworkStatus,
  setAuthPending,
} from '../store/authSlice'

export default () => {
  const status = useSelector(selectAuthNetworkStatus)
  const dispatch = useDispatch()
  const authPageRef = useRef(null)

  const handleCloseLoginMenu = () => {
    dispatch(closeLoginMenu())
    authPageRef.current?.close()
  }
  const handleCancel = () => {
    dispatch(logoutUserAsync())
    handleCloseLoginMenu()
  }
  const startGoogleAuth = async () => {
    dispatch(setAuthPending())
    authPageRef.current = window.open(`/api/auth/google`, 'googleAuthPage', 'onclose')
    let pollWindow = setInterval(() => {
      if (authPageRef.current?.closed) {
        dispatch(authUserAsync())
        clearInterval(pollWindow)
      }
    }, 1000)
  }
  const handleTryAgain = () => {
    startGoogleAuth()
  }

  return (
    <dialog open>
      {status.state === 'pending' ? (
        <div>loading...</div>
      ) : status.error ? (
        <>
          <p>{status.error.message}</p>
          <button onClick={handleTryAgain}>Try again</button>
        </>
      ) : (
        <button onClick={startGoogleAuth}>Login or Register via Google</button>
      )}
      <button onClick={handleCancel}>Cancel</button>
    </dialog>
  )
}
