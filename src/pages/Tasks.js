import React, {Component} from 'react'

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
  Badge,
  Button,
  Pagination,
} from '@windmill/react-ui'
import {EditIcon, TrashIcon} from '../assets/icons'

import testdata from '../utils/demodata/studyData'
import {authMiddleWare} from "../utils/auth";

const resultsPerPage = 10
const totalResults = testdata.length

const TaskStatus = {
  FIRST_REVISION: {badge: "warning", name: "First Revision", identifier: "FIRST_REVISION"},
  SECOND_REVISION: {badge: "primary", name: "Second Revision", identifier: "SECOND_REVISION"},
  THIRD_REVISION: {badge: "success", name: "Third Revision", identifier: "THIRD_REVISION"}
};

function getTaskProperties(taskStatus, badgeOrName){
  let status = TaskStatus.FIRST_REVISION
  switch (taskStatus){
    case TaskStatus.SECOND_REVISION.identifier:
      status = TaskStatus.SECOND_REVISION
      break
    case TaskStatus.THIRD_REVISION.identifier:
      status = TaskStatus.THIRD_REVISION
      break
    default:
      break
  }
  if(badgeOrName === "BADGE"){
    return status.badge
  } else {
    return status.name
  }
}

class Tasks extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataTable: [],
      pageTable: 1,
      uiLoading: true,
      imageLoading: false
    };
  }

  onPageChangeTable = (p) => {
    this.setState({
      pageTable: p,
      dataTable: testdata.slice((p - 1) * resultsPerPage, p * resultsPerPage)
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
                {this.state.dataTable.map((user, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <span className="text-sm">{user.task}</span>
                      </TableCell>

                      <TableCell>
                        <Badge type={getTaskProperties(user.status, "BADGE")}>
                          {getTaskProperties(user.status, "NAME")}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm">{new Date(user.date_due).toLocaleDateString()}</span>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm">{new Date(user.date_created).toLocaleDateString()}</span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <Button layout="link" size="icon" aria-label="Edit">
                            <EditIcon className="w-5 h-5" aria-hidden="true" />
                          </Button>
                          <Button layout="link" size="icon" aria-label="Delete">
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
                  totalResults={totalResults}
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
