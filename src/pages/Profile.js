import React from 'react'

import PageTitle from '../components/Typography/PageTitle'
import {Input, Label, Textarea, Button} from '@windmill/react-ui'

import {Link} from "react-router-dom";

function Profile() {
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
                    <Input disabled className="mt-2" placeholder="name@email.com" />
                    <span className="mt-4">Email is read only.</span>
                </Label>

                <Button className="mt-6" block tag={Link}>
                    Save Changes
                </Button>
            </div>
        </>
    )
}

export default Profile
