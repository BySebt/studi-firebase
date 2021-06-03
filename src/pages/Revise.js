import React, {Component} from 'react'
import InfoCard from '../components/Cards/InfoCard'
import PageTitle from '../components/Typography/PageTitle'
import {TaskLeftIcon, CompletedIcon, DueIcon, TotalIcon, StudyiIcon, EditIcon, TrashIcon} from '../assets/icons'
import RoundIcon from '../components/Misc/RoundIcon'
import {getButtonClass, getTaskColor, titleCase} from "../utils/utils";

import {
    Button, Pagination,
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
import {CircularProgress} from "@material-ui/core";

const resultsPerPage = 10

class Revise extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tasksDue: [],
            dataTable: [],
            totalTime: 0,
            pageTable: 1,
            loading: true,
            revisionInProgress: false,
        };

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(state => ({
            revisionInProgress: true
        }));
    }

    componentDidMount = () => {
        const authToken = localStorage.getItem("AuthToken");
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .get("/todos")
            .then((response) => {
                let due_today = [];
                let total_time = 0;
                response.data.forEach(item => {
                    if(Date.now() > item.next_due_date){
                        due_today.push(item);
                        total_time += item.time_required
                    }
                })
                this.setState({
                    tasksDue: due_today,
                    totalTime: total_time,
                    dataTable: due_today.slice(0, resultsPerPage),
                    loading: false,
                });
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    localStorage.removeItem("AuthToken");
                    this.props.history.push("/login");
                }
                console.log(error);
            });

        this.setState({
            pageTable: 1,
        })
    };

    onPageChangeTable = (p) => {
        this.setState({
            pageTable: p,
            dataTable: this.state.tasksDue.slice((p - 1) * resultsPerPage, p * resultsPerPage)
        })
    }


    render() {
        if(this.state.loading)
            return (
                <span className="text-lg p-5">Loading...</span>
            )

        if(this.state.revisionInProgress){
            return (
                <>
                    <PageTitle>Revision In Progress</PageTitle>

                    <div className="grid gap-6 mb-8 md:grid-cols-2">
                        <InfoCard title="Time Left" value="38 minutes">
                            <RoundIcon
                                icon={DueIcon}
                                iconColorClass="text-purple-500 dark:text-purple-100"
                                bgColorClass="bg-purple-100 dark:bg-purple-500"
                                className="mr-4"
                            />
                        </InfoCard>

                        <InfoCard title="Tasks Left" value="2">
                            <RoundIcon
                                icon={TotalIcon}
                                iconColorClass="text-blue-500 dark:text-blue-100"
                                bgColorClass="bg-blue-100 dark:bg-blue-500"
                                className="mr-4"
                            />
                        </InfoCard>
                    </div>

                    <SectionTitle>Current Task</SectionTitle>

                    <DescriptionCard className="mb-5" title="Electricity Tramission" value="Page 39"/>

                    <div className="mt-5 grid gap-6 mb-8 grid-cols-2">
                        <button className={getButtonClass("green")}>Complete</button>
                        <button className={getButtonClass("red")}>Skip</button>
                    </div>
                </>)
        }

        if(this.state.tasksDue.length === 0){
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
                        <InfoCard title="Estimated Time" value={this.state.totalTime + " minutes"}>
                            <RoundIcon
                                icon={DueIcon}
                                iconColorClass="text-purple-500 dark:text-purple-100"
                                bgColorClass="bg-purple-100 dark:bg-purple-500"
                                className="mr-4"
                            />
                        </InfoCard>

                        <InfoCard title="Total Tasks Due" value={this.state.tasksDue.length}>
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
                                    {this.state.dataTable.map((task, i) => (
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
                                    totalResults={this.state.tasksDue.length}
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
