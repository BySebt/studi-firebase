import React, {Component} from 'react'

import PageTitle from '../components/Typography/PageTitle'
import {authMiddleWare} from "../utils/auth";
import InfoCard from "../components/Cards/InfoCard";
import RoundIcon from "../components/Misc/RoundIcon";
import {CompletedIcon, DueIcon, TaskLeftIcon, TotalIcon} from "../assets/icons";
import ChartCard from "../components/Chart/ChartCard";
import {Line} from "react-chartjs-2";
import {lineLegends, lineOptions} from "../utils/demodata/chartsData";
import ChartLegend from "../components/Chart/ChartLegend";


class About extends Component {

    constructor(props) {
        super(props);

        this.state = {
            uiLoading: true,
            imageLoading: false
        };
    }

    render() {
        return (
            <>
                <PageTitle>About</PageTitle>
                <span className="text-gray-800 dark:text-gray-200">Studyi is a school project, aimed to help students remember and revise tasks following the forgetting curve.</span>
            </>
        )
    }

}

export default About
