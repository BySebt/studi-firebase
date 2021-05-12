import React, { useState, useEffect } from 'react'

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
import { EditIcon, TrashIcon } from '../icons'

import testdata from '../utils/demo/studyData'
// make a copy of the data, for the second table

function Tasks() {
  /**
   * DISCLAIMER: This code could be badly improved, but for the sake of the example
   * and readability, all the logic for both table are here.
   * You would be better served by dividing each table in its own
   * component, like Table(?) and TableWithActions(?) hiding the
   * presentation details away from the page view.
   */

  // setup pages control for every table
  const [pageTable2, setPageTable2] = useState(1)

  // setup data for every table
  const [dataTable2, setDataTable2] = useState([])

  // pagination setup
  const resultsPerPage = 10
  const totalResults = testdata.length

  // pagination change control
  function onPageChangeTable2(p) {
    setPageTable2(p)
  }

  var TaskStatus = {
    FIRST_REVISION : {badge: "warning", name: "First Revision", identifier: "FIRST_REVISION"},
    SECOND_REVISION: {badge: "primary", name: "Second Revision", identifier: "SECOND_REVISION"},
    THIRD_REVISION : {badge: "success", name: "Third Revision", identifier: "THIRD_REVISION"}
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

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setDataTable2(testdata.slice((pageTable2 - 1) * resultsPerPage, pageTable2 * resultsPerPage))
  }, [pageTable2])

  return (
    <>
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
            {dataTable2.map((user, i) => (
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
            onChange={onPageChangeTable2}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </>
  )
}

export default Tasks
