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
import DescriptionCard from "../components/Cards/DescriptionCard";
import axios from "axios";

const resultsPerPage = 10


function getEmptyRevisonDocument(){
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

function getNewRevisionDocument(tasks_due, total_time){
    return {
        finish_time: -1,
        finished: false,
        start_time: Date.now(),
        task_completed: 0,
        tasks_left: tasks_due.size,
        total_tasks: tasks_due.size,
        tasks_skipped: 0,
        time_left: total_time,
        revision_tasks: tasks_due
    };
}

class Revise extends Component {

    constructor(props) {
        super(props);

        this.state = {
            current_revision: [],
            dataTable: [],
            totalTime: 0,
            pageTable: 1,
            loading: true,
            revisionInProgress: false,
        };

        // This binding is necessary to make `this` work in the callback
        this.handleCompleteClick = this.handleCompleteClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(state => ({
            revisionInProgress: true
        }));
    }

    handleCompleteClick(taskID) {
        console.log("Click")
        // let current_revision = this.state.current_revision;
        // let i = 0
        // for(i; i < current_revision.revision_tasks.length; i++){
        //     if (current_revision.revision_tasks[i].id === taskID) {
        //         current_revision.revision_tasks[i].finished = true;
        //         current_revision.time_left -= current_revision.revision_tasks[i].time_required;
        //     }
        // }
        //
        // current_revision.tasks_left -= 1;
        // current_revision.task_completed += 1;
        //
        // console.log(current_revision);

        // axios.post("/revision/completed", )
        // axios.defaults.headers.common = { Authorization: `${localStorage.getItem("AuthToken")}`};
        //
        // axios.
        //
        //
        // let array = [...this.state.current_revision];
        // console.log(array)
        // array.revision_tasks.slice(1);
        // this.setState({
        //     current_revision: array
        // })
    }

    componentDidMount = () => {
        axios.defaults.headers.common = { Authorization: `${localStorage.getItem("AuthToken")}`};

        axios.get("/revision")
            .then((response) =>{
                if(response.data.status === "NO_PENDING_TASK"){
                    return axios.get("/todos");
                } else {
                    console.log(response.data.revisionDoc)
                    this.setState({
                        current_revision: response.data.revisionDoc,
                        loading: false,
                    })
                    return null;
                }
            })
            .then((response) => {
                if(response == null){
                    return null;
                }
                let due_today = [];
                let total_time = 0;

                if(response.data.size === 0){
                    this.setState({
                        revision_document: getEmptyRevisonDocument(),
                    })
                    return null;
                }

                response.data.forEach(item => {
                    if(Date.now() > item.next_due_date){
                        due_today.push(item);
                        total_time += item.time_required
                    }
                })

                const revision_document = getNewRevisionDocument(due_today, total_time);

                this.setState({
                    current_revision: revision_document,
                })

                console.log(revision_document)

                return axios.post("/revision/new", revision_document);
            })
            .then((response) => {
                if(response == null){
                    return null;
                }
                this.setState({
                    loading: false
                })
            })
    };

    onPageChangeTable = (p) => {
        this.setState({
            pageTable: p,
            dataTable: this.state.current_revision.revision_tasks.slice((p - 1) * resultsPerPage, p * resultsPerPage)
        })
    }


    render() {
        if(this.state.loading || !(this.state.current_revision))
            return (
                <span className="text-lg p-5">Loading...</span>
            )

        if(this.state.revisionInProgress){
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

                    <DescriptionCard className="mb-5" title={`${this.state.current_revision.revision_tasks[0].name}`} value={`${this.state.current_revision.revision_tasks[0].description}`}/>

                    <div className="mt-5 grid gap-6 mb-8 grid-cols-2">
                        <button onClick={this.handleCompleteClick("kHzIVfDPC0VdxtJcoaao")} className={getButtonClass("green") }>Complete</button>
                        {/*<button className={getButtonClass("red")}>Skip</button>*/}
                    </div>
                </>)
        }

        if(this.state.current_revision.revision_tasks.length === 0){
            return (
                <>
                    <PageTitle>Tasks Due Today</PageTitle>
                    <SectionTitle>Nothing due! All caught up.</SectionTitle>
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
                    <button className={getButtonClass("green")} onClick={this.handleClick}>Start</button>

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
                                    totalResults={this.state.current_revision.revision_tasks.size}
                                    resultsPerPage={resultsPerPage}
                                    onChange={this.onPageChangeTable}
                                    label="Table navigation"
                                />
                            </TableFooter>
                        </TableContainer>
                </>)
        }
}

export default Revise
