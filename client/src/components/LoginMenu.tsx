import React, { useState } from 'react'
//import axios from 'axios'

// const googleAuth = async ({ setDone, setError }: {setDone: () => void, setError: (msg: string) => void}) => {
//   const requestAuth = async () => {
//     try {
//       const res = await axios("/api/auth");
//       if (res.status === 200) {
//         setDone();
//       }
//     } catch (error) {
//       if (error.response.status === 401) {
//         setError("Authentication unsuccessful, please select a google account to sign in with.")
//       } else {
//         setError("Woppps something went wrong!")
//         console.error(error);
//       }
//     }
//   };
//   const googleAuthPage = window.open(
//     `/api/auth/google`,
//     "googleAuthPage",
//     "onclose"
//   );
//   let pollWindow = setInterval(() => {
//     if (googleAuthPage?.closed) {
//       requestAuth();
//       clearInterval(pollWindow);
//     }
//   }, 1000);
// };

export default ({setDone}: {setDone: () => void}) => {
    const [error, setError] = useState(null)
    const handleTryAgain = () => {
        setError(null)
     //   googleAuth({ setDone, setError })
    }
    // useEffect(() => {
    //     googleAuth({ setDone, setError })
    // }, [])
    return (
        <dialog open> 
            { error ? <>
                <p>{error}</p>
                <button onClick={handleTryAgain}>Try again</button>
                <button onClick={() => setDone()}>Cancel</button>
                </> :
                <iframe src="/api/auth/google" />
            }
        </dialog>
    )
}