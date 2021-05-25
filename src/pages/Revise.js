import React, {Component} from 'react'
import InfoCard from '../components/Cards/InfoCard'
import PageTitle from '../components/Typography/PageTitle'
import {TaskLeftIcon, CompletedIcon, DueIcon, TotalIcon, StudyiIcon, EditIcon, TrashIcon} from '../assets/icons'
import RoundIcon from '../components/Misc/RoundIcon'

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
import testdata from "../utils/demodata/studyData";
import SectionTitle from "../components/Typography/SectionTitle";
import DescriptionCard from "../components/Cards/DescriptionCard";

const resultsPerPage = 10
const totalResults = testdata.length

function getButtonClass(color){
    return `align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-${color}-400 border border-transparent active:bg-${color}-400 hover:bg-${color}-500 focus:shadow-outline-${color}`
}

class Revise extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataTable: [],
            pageTable: 1,
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
        this.setState({
            pageTable: 1,
            dataTable: testdata
        })
    };

    onPageChangeTable = (p) => {
        this.setState({
            pageTable: p,
            dataTable: testdata.slice((p - 1) * resultsPerPage, p * resultsPerPage)
        })
    }


    render() {

        if(this.state.revisionInProgress){
            return (
                <>
                    <PageTitle>Revision In Progress</PageTitle>

                    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
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
        } else {
            return (
                <>
                    <PageTitle>Revision</PageTitle>
                    <SectionTitle>Here is a summary of what you'll study today.</SectionTitle>

                    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                        <InfoCard title="Estimated Time" value="45 minutes">
                            <RoundIcon
                                icon={DueIcon}
                                iconColorClass="text-purple-500 dark:text-purple-100"
                                bgColorClass="bg-purple-100 dark:bg-purple-500"
                                className="mr-4"
                            />
                        </InfoCard>

                        <InfoCard title="Total Tasks Due" value="3">
                            <RoundIcon
                                icon={TotalIcon}
                                iconColorClass="text-blue-500 dark:text-blue-100"
                                bgColorClass="bg-blue-100 dark:bg-blue-500"
                                className="mr-4"
                            />
                        </InfoCard>
                    </div>

                    <button
                        className={getButtonClass("green")}
                        onClick={this.handleClick}
                    >Start
                    </button>

                    <PageTitle>Tasks Due Today</PageTitle>

                    <TableContainer className="mb-8">
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableCell>Task</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date Created</TableCell>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {this.state.dataTable.map((user, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <span className="text-sm">{user.task}</span>
                                        </TableCell>
                                        <TableCell>
                                        <span
                                            className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-blue-700 bg-blue-100 dark:text-white dark:bg-blue-600 ">{user.status}</span>
                                        </TableCell>
                                        <TableCell>
                                        <span
                                            className="text-sm">{new Date(user.date_created).toLocaleDateString()}</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TableFooter>
                            <Pagination
                                totalResults={totalResults}
                                resultsPerPage={resultsPerPage}
                                onChange={this.onPageChangeTable}
                                label="Table navigation"
                            />
                        </TableFooter>
                    </TableContainer>
                </>)
        }


    }

}

export default Revise
