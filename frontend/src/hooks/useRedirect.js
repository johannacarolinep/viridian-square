import axios from "axios";
import {
    useEffect
} from "react";
import {
    useNavigate
} from "react-router-dom";

export const useRedirect = (userAuthStatus, pathStr) => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("INSIDE HOOK")
        console.log("userAuthStatus ", userAuthStatus)
        console.log('pathStr', pathStr)
        const handleMount = async () => {
            try {
                await axios.post('/dj-rest-auth/token/refresh/')
                console.log("LOGGED IN")
                // if user is logged in, the code below will run
                if (userAuthStatus === 'loggedIn') {
                    navigate(pathStr);
                }
            } catch (err) {
                // console.log(err);
                console.log("LOGGED OUT")
                if (userAuthStatus === 'loggedOut') {
                    navigate(pathStr);
                }
            }
        };

        handleMount();
    }, [navigate, userAuthStatus, pathStr]);
};