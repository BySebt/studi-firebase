import axios from "axios";
import {useHistory} from "react-router-dom";

export const handleError = (error, history) => {
    if(error.response.data && error.response.data.err){
        history.push(`/login/reason=${error.response.data.err}`)
    }
}

export const authMiddleWare = (history) => {
    const authToken = localStorage.getItem('AuthToken');
    if(authToken === null){
        history.push('/login/reason=NO_TOKEN')
        return;
    }
    //
    // verifyToken(authToken, history);
}

export const authLogin = (history) => {
    const authToken = localStorage.getItem('AuthToken');

    if(authToken === null){
        return;
    }

    verifyToken(authToken, history).then((r) => {
        if(r){
            history.push('/app/dashboard')
        }
    });

}

async function verifyToken(token, history){
    axios.defaults.headers.common = {Authorization: `${token}`};

    axios
        .get("/token")
        .then((response) => {
            if(response.data.err){
                localStorage.removeItem("AuthToken");
                history.push(`/login/reason=${response.data.err}`)
            } else {
                return true;
            }
        })
        .catch((error) => {
            console.log("ERROR: " + error);
            localStorage.removeItem("AuthToken");
            history.push(`/login/reason=UNKNOWN_ERROR`)
        });
}

