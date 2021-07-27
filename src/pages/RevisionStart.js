import firebase from 'firebase'
import React, {Component, useEffect, useState} from 'react'
import InfoCard from '../components/Cards/InfoCard'
import PageTitle from '../components/Typography/PageTitle'
import {DueIcon, TotalIcon} from '../assets/icons'
import RoundIcon from '../components/Misc/RoundIcon'
import {getButtonClass, getTaskColor, titleCase} from "../utils/utils";

import {
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHeader,
    TableRow
} from "@windmill/react-ui";
import SectionTitle from "../components/Typography/SectionTitle";
import axios from "axios";

const resultsPerPage = 10

function getEmptyRevisonDocument() {
    return {
        finish_time: -1,
        finished: true,
        start_time: Date.now(),
        task_completed: 0,
        tasks_left: 0,
        total_tasks: 0,
        tasks_skipped: 0,
        time_left: 0,
        revision_tasks: []
    };
}

function l(message) {
    console.log("[REVISION] " + message);
}

function getNewRevisionDocument(tasks_due, total_time) {
    return {
        finish_time: -1,
        finished: false,
        start_time: Date.now(),
        task_completed: 0,
        tasks_left: tasks_due.length,
        total_tasks: tasks_due.length,
        tasks_skipped: 0,
        time_left: total_time,
        revision_tasks: tasks_due
    };
}

export default function RevisionStart(){
    const [currentRevision, setCurrentRevision] = useState({});
    const [dataTable, setDataTable] = useState([]);
    const [pageTable, setPageTable] = useState(1);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("DEFAULT");
    const [revisionID, setRevisionID] = useState("");

    function beginRevision(revisionID) {
        if(revisionID == null)
            return;
        this.props.history.push(`/app/revise/${revisionID}`)
    }

    function onPageChangeTable(p) {
        setPageTable(p)
        setDataTable(currentRevision.revision_tasks.slice((p - 1) * resultsPerPage, p * resultsPerPage))
    }

    function handleClick(event) {
        event.preventDefault();

        if (status === "NEW_REVISION") {
            axios.post("/revision/new", currentRevision)
                .then((response) => {
                    console.log(response)
                    beginRevision(response.data)
                }).catch((error) => {
                console.log(error)
            })
        } else {
            this.setState(state => ({
                status: "IN_PROGRESS"
            }));
            beginRevision(revisionID)
        }

    }

    // This function is called when the page is first loaded
    useEffect(() => {

        firebase.auth().currentUser.getIdToken()
            .then((token) => {
                axios.defaults.headers.common = {Authorization: `Bearer ${token}`};

                l("Component did mount.");

                // First make a request to /revision to check for an unfinished revisions
                axios.get("/revision")
                    .then((response) => {
                        // If there are no pending revisions
                        if (response.data.status === "NO_PENDING_REVISION") {
                            l("No pending revision found.");

                            // Proceed to fetch a list of tasks
                            return axios.get("/todos/due");
                        } else {
                            l("Pending revision found:");
                            console.log(response.data.revisionDoc)

                            l("Updating state. FINISHED!");

                            setRevisionID(response.data.revisionDoc.id)
                            setCurrentRevision(response.data.revisionDoc)
                            setStatus("PENDING_REVISION")
                            setLoading(false)
                            return null;
                        }
                    })
                    .then((response) => {
                        if (response == null) {
                            return null;
                        }
                        let due_today = [];
                        let total_time = 0;

                        console.log(response.data)

                        if (response.data.length === 0) {
                            l("No due tasks.");

                            setCurrentRevision(getEmptyRevisonDocument())
                            setStatus("NONE_DUE")
                            setLoading(false)

                            return null;
                        }

                        l("Due tasks found.");

                        response.data.forEach(item => {
                            if (Date.now() > item.next_due_date) {
                                due_today.push(item);
                                total_time += item.time_required
                            }
                        })

                        const revision_document = getNewRevisionDocument(due_today, total_time);

                        l("Updating state. FINISHED!");

                        setCurrentRevision(revision_document)
                        setStatus("NEW_REVISION")
                        setLoading(false)
                    })
            })
        // The empty array prevents infinite loops
    }, []);


    if (loading || !(currentRevision))
        return (
            <span className="text-lg p-5">Loading...</span>
        )

    if (status === "NONE_DUE") {
        return (
            <>
                <PageTitle>Tasks Due Today</PageTitle>
                <SectionTitle>Nothing due! All caught up.</SectionTitle>
            </>)
    }

    if (status === "FINISHED") {
        return (
            <>
                <PageTitle>Finished!</PageTitle>
                <SectionTitle>You are all done for today. Good job!</SectionTitle>
            </>)
    }

    return (
        <>
            <PageTitle>Revision</PageTitle>
            <SectionTitle>Here is a summary of what you'll study today.</SectionTitle>

            <div className="grid gap-6 mb-8 md:grid-cols-2">
                <InfoCard title="Estimated Time" value={currentRevision.time_left + " minutes"}>
                    <RoundIcon
                        icon={DueIcon}
                        iconColorClass="text-purple-500 dark:text-purple-100"
                        bgColorClass="bg-purple-100 dark:bg-purple-500"
                        className="mr-4"
                    />
                </InfoCard>

                <InfoCard title="Total Tasks Due" value={currentRevision.total_tasks}>
                    <RoundIcon
                        icon={TotalIcon}
                        iconColorClass="text-blue-500 dark:text-blue-100"
                        bgColorClass="bg-blue-100 dark:bg-blue-500"
                        className="mr-4"
                    />
                </InfoCard>
            </div>
            <button className={getButtonClass(status === "NEW_REVISION" ? "green" : "purple")}
                    onClick={handleClick}>{status === "NEW_REVISION" ? "Start a new Revision" : "Continue Revision"}</button>

            <PageTitle>Tasks Due Today</PageTitle>

            <TableContainer className="mb-8">
                <Table>
                    <TableHeader>
                        <tr>
                            <TableCell>Task</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Time Required</TableCell>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {currentRevision.revision_tasks.map((task, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <span className="text-sm">{task.name}</span>
                                </TableCell>

                                <TableCell>
                                    <span className={getTaskColor(task.status)}>{titleCase(task.status)}{" "}</span>
                                </TableCell>

                                <TableCell>
                                        <span
                                            className="text-sm">{task.time_required + " minutes"}</span>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TableFooter>
                    <Pagination
                        totalResults={currentRevision.revision_tasks.length}
                        resultsPerPage={resultsPerPage}
                        onChange={onPageChangeTable}
                        label="Table navigation"
                    />
                </TableFooter>
            </TableContainer>
        </>)
}

