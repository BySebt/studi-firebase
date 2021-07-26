import React, {Component} from 'react'
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

class RevisionStart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            current_revision: {},
            current_task: [],
            dataTable: [],
            totalTime: 0,
            pageTable: 1,
            loading: true,
            new_revision: false,
            status: "DEFAULT",
            revision_id: ""
        };

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    beginRevision(revision_id) {
        if(revision_id == null)
            return;
        this.props.history.push(`/app/revise/${revision_id}`)
    }

    handleClick() {
        if (this.state.status === "NEW_REVISION") {
            axios.post("/revision/new", this.state.current_revision)
                .then((response) => {
                    console.log(response)
                    this.beginRevision(response.data)
                }).catch((error) => {
                console.log(error)
            })
        } else {
            this.setState(state => ({
                status: "IN_PROGRESS"
            }));
            this.beginRevision(this.state.revision_id)
        }

    }

    // This function is called when the page is first loaded
    componentDidMount = () => {
        axios.defaults.headers.common = {Authorization: `${localStorage.getItem("AuthToken")}`};

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
                    this.setState({
                        revision_id: response.data.revisionDoc.id,
                        current_revision: response.data.revisionDoc,
                        status: "PENDING_REVISION",
                        loading: false,
                    })
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
                    this.setState({
                        revision_document: getEmptyRevisonDocument(),
                        status: "NONE_DUE",
                        loading: false,
                    })
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

                this.setState({
                    current_revision: revision_document,
                    status: "NEW_REVISION",
                    loading: false
                })

                console.log(revision_document)
            })

    };

    onPageChangeTable = (p) => {
        this.setState({
            pageTable: p,
            dataTable: this.state.current_revision.revision_tasks.slice((p - 1) * resultsPerPage, p * resultsPerPage)
        })
    }


    render() {
        if (this.state.loading || !(this.state.current_revision))
            return (
                <span className="text-lg p-5">Loading...</span>
            )

        if (this.state.status === "NONE_DUE") {
            return (
                <>
                    <PageTitle>Tasks Due Today</PageTitle>
                    <SectionTitle>Nothing due! All caught up.</SectionTitle>
                </>)
        }

        if (this.state.status === "FINISHED") {
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
                    <InfoCard title="Estimated Time" value={this.state.current_revision.time_left + " minutes"}>
                        <RoundIcon
                            icon={DueIcon}
                            iconColorClass="text-purple-500 dark:text-purple-100"
                            bgColorClass="bg-purple-100 dark:bg-purple-500"
                            className="mr-4"
                        />
                    </InfoCard>

                    <InfoCard title="Total Tasks Due" value={this.state.current_revision.total_tasks}>
                        <RoundIcon
                            icon={TotalIcon}
                            iconColorClass="text-blue-500 dark:text-blue-100"
                            bgColorClass="bg-blue-100 dark:bg-blue-500"
                            className="mr-4"
                        />
                    </InfoCard>
                </div>
                <button className={getButtonClass(this.state.status === "NEW_REVISION" ? "green" : "purple")}
                        onClick={this.handleClick}>{this.state.status === "NEW_REVISION" ? "Start a new Revision" : "Continue Revision"}</button>

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
                            {this.state.current_revision.revision_tasks.map((task, i) => (
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
                            totalResults={this.state.current_revision.revision_tasks.length}
                            resultsPerPage={resultsPerPage}
                            onChange={this.onPageChangeTable}
                            label="Table navigation"
                        />
                    </TableFooter>
                </TableContainer>
            </>)
    }
}

export default RevisionStart
