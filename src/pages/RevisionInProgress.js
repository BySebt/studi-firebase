import React, {Component} from 'react'
import InfoCard from '../components/Cards/InfoCard'
import PageTitle from '../components/Typography/PageTitle'
import {DueIcon, TotalIcon} from '../assets/icons'
import RoundIcon from '../components/Misc/RoundIcon'
import {getButtonClass} from "../utils/utils";
import SectionTitle from "../components/Typography/SectionTitle";
import DescriptionCard from "../components/Cards/DescriptionCard";
import axios from "axios";
import {Button} from "@windmill/react-ui"

function l(message) {
    console.log("[REVISION] " + message);
}

class RevisionInProgress extends Component {

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
        };

        // This binding is necessary to make `this` work in the callback
        this.handleCompleteClick = this.handleCompleteClick.bind(this);
        this.handleDashboard = this.handleDashboard.bind(this);
    }

    handleDashboard(){
        this.props.history.push("/app/dashboard")
    }

    handleCompleteClick() {
        let revision_tasks = this.state.current_revision.revision_tasks;
        let revision = this.state.current_revision;
        let pending_unfinished_task = false;
        const finished_task_id = this.state.current_task.id;

        // Loop through tasks
        for (let i = 0; i < revision_tasks.length; i++) {
            // If the task ids match
            if (revision_tasks[i].id === finished_task_id) {
                // Set task to finished
                revision_tasks[i].finished = true;

                // Remove time left
                revision.time_left -= revision_tasks[i].time_required;
                revision.tasks_left -= 1;
                revision.task_completed++;

                // The id of the finished task
                revision.finished_task_id = finished_task_id;
                revision.finished_task_status = this.state.current_task.status;

                // Find a new task
                for (let j = 0; j < revision_tasks.length; j++) {
                    if (revision_tasks[j].finished === false) {
                        // There is an unfinished task
                        pending_unfinished_task = true;
                        this.setState({
                            current_task: revision_tasks[j],
                        })
                    }
                }

                // If there are no tasks left (i.e finished)
                if (!pending_unfinished_task) {
                    revision.finished = true;

                    axios.delete(`/revision/${revision.id}`)
                        .then((response) => {
                            console.log(response)
                        })
                        .catch((error) => {
                            console.log(error)
                        })

                    this.setState({
                        status: "FINISHED",
                    })
                }
                axios.post("/revision/completed", revision)
                    .then((response) => {
                        if (response == null) {
                            return null;
                        }
                    })

                // No tasks left
                break;
            }
        }
    }

    // This function is called when the page is first loaded
    componentDidMount = () => {
        axios.defaults.headers.common = {Authorization: `${localStorage.getItem("AuthToken")}`};

        console.log("Revision ID: " + this.props.match.params.id)

        // First make a request to /revision to check for an unfinished revisions
        axios.get(`/revision/${this.props.match.params.id}`)
            .then((response) => {

                if (response.data.error) {
                    this.setState({
                        status: "REVISION_NOT_FOUND",
                    })
                }

                console.log(response.data.revisionDoc)

                this.setState({
                    current_task: response.data.revisionDoc.revision_tasks[0],
                    current_revision: response.data.revisionDoc,
                    loading: false,
                })
                return null;

            })
    };

    render() {
        if (this.state.loading || !(this.state.current_revision))
            return (
                <span className="text-lg p-5">Loading...</span>
            )

        if(this.state.status === "REVISION_NOT_FOUND"){
            return (
                <>
                    <PageTitle>Task not found!!</PageTitle>
                    <SectionTitle>This task does not exist, or has been completed already.</SectionTitle>
                    <Button onClick={this.handleDashboard}>Dashboard</Button>
                </>)
        }

        if(this.state.status === "FINISHED"){
            return (
                <>
                    <PageTitle>Finished!</PageTitle>
                    <SectionTitle>You are all done for today. Good job!</SectionTitle>
                    <Button onClick={this.handleDashboard}>Dashboard</Button>
                </>)
        }

        return (
            <>
                <PageTitle>Revision In Progress</PageTitle>

                <div className="grid gap-6 mb-8 md:grid-cols-2">
                    <InfoCard title="Time Left" value={`${this.state.current_revision.time_left} minutes`}>
                        <RoundIcon
                            icon={DueIcon}
                            iconColorClass="text-purple-500 dark:text-purple-100"
                            bgColorClass="bg-purple-100 dark:bg-purple-500"
                            className="mr-4"
                        />
                    </InfoCard>

                    <InfoCard title="Tasks Left" value={`${this.state.current_revision.tasks_left} Tasks`}>
                        <RoundIcon
                            icon={TotalIcon}
                            iconColorClass="text-blue-500 dark:text-blue-100"
                            bgColorClass="bg-blue-100 dark:bg-blue-500"
                            className="mr-4"
                        />
                    </InfoCard>
                </div>

                <SectionTitle>Current Task</SectionTitle>

                <DescriptionCard className="mb-5" title={`${this.state.current_task.name}`}
                                 value={`${this.state.current_task.description}`}/>

                <div className="mt-5 grid gap-6 mb-8 grid-cols-2">
                    <button onClick={this.handleCompleteClick} className={getButtonClass("green")}>Complete Task
                    </button>
                    <button className={getButtonClass("red")}>Finish Revision</button>
                </div>
            </>)
    }
}

export default RevisionInProgress
