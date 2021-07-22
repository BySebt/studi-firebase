import React, { Component, useState, useEffect } from 'react'
import InfoCard from '../components/Cards/InfoCard'
import ChartCard from '../components/Chart/ChartCard'
import { Line } from 'react-chartjs-2'
import ChartLegend from '../components/Chart/ChartLegend'
import PageTitle from '../components/Typography/PageTitle'
import { TaskLeftIcon, CompletedIcon, DueIcon, TotalIcon, StudyiIcon } from '../assets/icons'
import RoundIcon from '../components/Misc/RoundIcon'
import axios from "axios";


import {
  lineOptions,
  lineLegends,
} from '../utils/demodata/chartsData'
import {authMiddleWare} from "../utils/auth";


class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      graph_data: [],
      total_tasks: 0,
      due_this_week: 0,
      completed_today: 0,
      left_today: 0
    };
  }

  componentDidMount = () => {
    axios.get("/weekly")
        .then((r) => {
          console.log(r.data)
        })
  };

  render() {
    return (
        <>
      <PageTitle>Dashboard</PageTitle>

    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
      <InfoCard title="Total Tasks" value="68">
        <RoundIcon
            icon={TotalIcon}
            iconColorClass="text-purple-500 dark:text-purple-100"
            bgColorClass="bg-purple-100 dark:bg-purple-500"
            className="mr-4"
        />
      </InfoCard>

      <InfoCard title="Tasks due this Week" value="17">
        <RoundIcon
            icon={DueIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
        />
      </InfoCard>

      <InfoCard title="Tasks Completed Today" value="4">
        <RoundIcon
            icon={CompletedIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
        />
      </InfoCard>

      <InfoCard title="Tasks Left Today" value="2">
        <RoundIcon
            icon={TaskLeftIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
        />
      </InfoCard>
    </div>


    <PageTitle>Graphs</PageTitle>
    <div className="grid gap-6 mb-8">
      <ChartCard title="Percentage Completion Over Time">
        <Line {...lineOptions} />
        <ChartLegend legends={lineLegends} />
      </ChartCard>
    </div>
        </>)}

}

export default Dashboard
