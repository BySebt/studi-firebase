import React from 'react'

import { useHistory } from "react-router-dom"
import PageTitle from '../components/Typography/PageTitle'
import {Input, Label, Textarea, Button} from '@windmill/react-ui'

import {Link} from "react-router-dom";
import axios from "axios";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";

function Profile() {

    let history = useHistory();

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const delete_account = () => {
        axios
            .delete(`/user/delete/${localStorage.getItem('userID')}`)
            .then(() => {
                localStorage.removeItem("AuthToken");
                localStorage.removeItem("userID");
                history.push(`/login/reason=ACCOUNT_DELETED`)
            })
            .catch((error) =>{
                console.log("Error: " + error.code)
            })
        setOpen(false);
    };

    function showConfirm() {
        setOpen(true);
    }

    return (
        <>
            <PageTitle>Edit Profile</PageTitle>

            <div className="px-4 py-4 mb-16 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <Label>
                    <span>Name</span>
                    <Input className="mt-2" placeholder="Studyi User" />
                </Label>

                <Label className="mt-4">
                    <span>Password</span>
                    <Input className="mt-2" placeholder="********" type="password" />
                </Label>

                <Label className="mt-4">
                    <span>Email</span>
                    <Input className="mt-2" placeholder="name@email.com" />
                    {/*<span className="mt-4">Email is read only.</span>*/}
                </Label>

                <Button className="mt-6" block tag={Link}>
                    Save Changes
                </Button>

                <Button className="mt-6" onClick={showConfirm}>
                    Delete Account
                </Button>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Account Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete your account? This action is irreversible.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={delete_account}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
}

export default Profile
