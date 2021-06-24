import React, {Component} from "react";
import {Skeleton} from "@material-ui/lab";

import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import {
    Table,
    TableHeader,
    TableCell,
    TableBody,
    TableRow,
    TableFooter,
    TableContainer,
    Button,
    Pagination,
} from "@windmill/react-ui";
import {EditIcon, TrashIcon} from "../assets/icons";

import dummyData from "../utils/demodata/studyData";
import axios from "axios";
import {getButtonClass, getTaskColor, titleCase} from "../utils/utils";
import {authMiddleWare, handleError} from "../utils/auth";

const resultsPerPage = 10;

class Tasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cacheData: dummyData,
            dataTable: dummyData,
            pageTable: 1,
            totalResults: 10,
            loading: true,
            imageLoading: false,
        };
    }

    handleCreateClick = () => {
        this.props.history.push("/app/create");
    };

    handleClick = (event) => {
        const task_id = event.currentTarget.parentNode.getAttribute("data-key");
        const authToken = localStorage.getItem("AuthToken");

        this.setState({
            loading: true,
        });

        axios.defaults.headers.common = {Authorization: `${authToken}`};
        axios
            .delete(`/todo/${task_id}`)
            .then((response) => {
                this.componentDidMount();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    componentDidMount() {
        const authToken = localStorage.getItem("AuthToken");
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        axios
            .get("/todos")
            .then((response) => {
                console.log(response.data)
                this.setState({
                    cacheData: response.data,
                    dataTable: response.data.slice(0, resultsPerPage),
                    totalResults: response.data.length,
                    loading: false,
                });
            })
            .catch((error) => {
                handleError(error, this.props.history);
                this.setState({errorMsg: "Error in retrieving the data."});
            });
    }

    onPageChangeTable = (p) => {
        this.setState({
            pageTable: p,
            dataTable: this.state.cacheData.slice(
                (p - 1) * resultsPerPage,
                p * resultsPerPage
            ),
        });
    };

    render() {
        return (
            <>
                <div className='flex mb-4 justify-between'>
                    <PageTitle>Tasks</PageTitle>

                    <button
                        className={"my-6 " + getButtonClass("green")}
                        onClick={this.handleCreateClick}>
                        Create a task
                    </button>
                </div>

                <SectionTitle>All Tasks</SectionTitle>

                <TableContainer className='mb-8'>
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableCell>Task</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Time Required</TableCell>

                                <TableCell>Date Due</TableCell>
                                <TableCell>Date Created</TableCell>
                                <TableCell>Actions</TableCell>
                            </tr>
                        </TableHeader>
                        <TableBody>
                            {this.state.dataTable.map((task, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                    <span className='text-sm'>
                      {this.state.loading ? (
                          <Skeleton animation='wave'/>
                      ) : (
                          task.name
                      )}
                    </span>
                                    </TableCell>

                                    <TableCell>
                                        {this.state.loading ? (
                                            <Skeleton animation='wave'/>
                                        ) : (
                                            <span className={getTaskColor(task.status)}>
                        {titleCase(task.status)}{" "}
                      </span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                    <span className='text-sm text-center'>
                      {this.state.loading ? (
                          <Skeleton animation='wave'/>
                      ) : (
                          task.time_required + " minutes"
                      )}
                    </span>
                                    </TableCell>

                                    <TableCell>
                    <span className='text-sm'>
                      {this.state.loading ? (
                          <Skeleton animation='wave'/>
                      ) : (
                          new Date(task.next_due_date).toLocaleDateString()
                      )}
                    </span>
                                    </TableCell>

                                    <TableCell>
                    <span className='text-sm'>
                      {this.state.loading ? (
                          <Skeleton animation='wave'/>
                      ) : (
                          new Date(task.date_created).toLocaleDateString()
                      )}
                    </span>
                                    </TableCell>

                                    <TableCell>
                                        <div
                                            className='flex items-center space-x-4'
                                            data-key={task.todoId}>
                                            <Button
                                                layout='link'
                                                size='icon'
                                                aria-label='Edit'
                                                disabled={this.state.loading}>
                                                <EditIcon className='w-5 h-5' aria-hidden='true'/>
                                            </Button>
                                            <Button
                                                layout='link'
                                                size='icon'
                                                aria-label='Delete'
                                                onClick={this.handleClick}
                                                disabled={this.state.loading}>
                                                <TrashIcon className='w-5 h-5' aria-hidden='true'/>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TableFooter>
                        <Pagination
                            totalResults={this.state.totalResults}
                            resultsPerPage={resultsPerPage}
                            onChange={this.onPageChangeTable}
                            label='Table navigation'
                        />
                    </TableFooter>
                </TableContainer>
            </>
        );
    }
}

export default Tasks;
