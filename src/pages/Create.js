import React from 'react'

import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import {Input, HelperText, Label, Select, Textarea, Button} from '@windmill/react-ui'

import { MailIcon } from '../icons'
import {Link} from "react-router-dom";

function Create() {
    return (
        <>
            <PageTitle>Create A New Task</PageTitle>

            <div className="px-4 py-4 mb-16 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <Label>
                    <span>Task</span>
                    <Input className="mt-2" placeholder="Do homework" />
                </Label>

                <Label className="mt-4">
                    <span>Task Description</span>
                    <Textarea className="mt-2" rows="3" placeholder="Enter description." />
                </Label>

                <Button className="mt-6" block tag={Link}>
                    Create
                </Button>
            </div>
        </>
    )
}

export default Create
