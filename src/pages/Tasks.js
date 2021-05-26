import React, {Component} from 'react'
import { Skeleton } from '@material-ui/lab';

import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
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
} from '@windmill/react-ui'
import {EditIcon, TrashIcon} from '../assets/icons'

import dummyData from '../utils/demodata/studyData'
import axios from "axios";

const resultsPerPage = 10


function titleCase(str) {
  str = str.replace("_", " ")
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

function getTaskColor(taskStatus){
  let color = "blue";

  switch (taskStatus){
    case "FIRST_REVISION":
      color = "pink";
      break;
    case "SECOND_REVISION":
      color = "orange"
          break;
    case "THIRD_REVISION":
      color = "blue"
  }

  return `inline-flex px-2 text-xs font-medium leading-5 rounded-full text-${color}-700 bg-${color}-100 dark:text-white dark:bg-${color}-600`;
}

class Tasks extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cacheData: [],
      dataTable: dummyData,
      pageTable: 1,
      totalResults: 10,
      uiLoading: true,
      imageLoading: false
    };
  }

  handleClick = (event) => {
    console.log(event.target.id)
}

  componentDidMount() {
    const authToken = localStorage.getItem('AuthToken');
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
        .get('/todos')
        .then((response) => {
          console.log(response)
          this.setState({
            cacheData: response.data,
            dataTable: response.data.slice(0, resultsPerPage),
            totalResults: response.data.length,
            uiLoading: false
          })
        })
        .catch((error) => {
          if (error.response.status === 403) {
            localStorage.removeItem('AuthToken');
            this.props.history.push('/login');
          }
          console.log(error);
          this.setState({ errorMsg: 'Error in retrieving the data.' });
        });
  }

  onPageChangeTable = (p) => {
    this.setState({
      pageTable: p,
      dataTable: this.state.cacheData.slice((p - 1) * resultsPerPage, p * resultsPerPage)
    })
  }

  render() {
    return (   <>
          <PageTitle>Tasks</PageTitle>

          <SectionTitle>All Tasks</SectionTitle>

          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Task</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date Due</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell>Actions</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {this.state.dataTable.map((task, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <span className="text-sm">{this.state.uiLoading ? <Skeleton animation="wave" /> : task.name}</span>
                      </TableCell>

                      <TableCell>
                        {this.state.uiLoading ? <Skeleton animation="wave" /> :
                        <span className={getTaskColor(task.status)}>{titleCase(task.status)} </span>}
                      </TableCell>

                      <TableCell>
                        <span className="text-sm">{this.state.uiLoading ? <Skeleton animation="wave" /> : new Date(task.next_due_date).toLocaleDateString()}</span>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm">{this.state.uiLoading ? <Skeleton animation="wave" /> : new Date(task.date_created).toLocaleDateString()}</span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-4" id={task.todoId}>
                          <Button layout="link" size="icon" aria-label="Edit">
                            <EditIcon className="w-5 h-5" aria-hidden="true" />
                          </Button>
                          <Button layout="link" size="icon" aria-label="Delete" id={task.todoId} onClick={this.handleClick}>
                            <TrashIcon className="w-5 h-5" aria-hidden="true" />
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
                  label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        </>
    )
  }

}

export default Tasks
