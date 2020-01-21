import React from "react";

import {Spinner, Container, Nav, NavItem, TabContent, Row, Col} from "reactstrap";

import PortfolioDropdown from "./Filters/PortfolioDropdown";
import CourseDropdown from "./Filters/CourseDropdown";
import DateFilters from "./Filters/DateFilters";
import ExportBtn from "./ExportBtn";
import SurveyResults from "./SurveyResults";
import UserDemographics from "./UserDemographics/UserDemographics";
import SurveyFunctions from "../../../../Lib/Content/Survey/SurveyFunctions";

/*
    This component will take in the current data retrieved from the api and
    process it before rendering the view.
*/
class Survey extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: new Date("2010/01/01"),
            endDate: new Date((new Date()).setHours(23, 59, 59, 999)),
            portfolioId: 0,
            courseId: 0,
            results: {},
            tab: "results"
        };

        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
        this.handlePortfolioChange = this.handlePortfolioChange.bind(this);
        this.handleCourseChange = this.handleCourseChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
    }

    // Lifecycle Methods
    componentDidMount() {
        const results = SurveyFunctions.getQuestionResults(
            this.props["surveyEntries"],
            this.state["startDate"].getTime() / 1000,
            this.state["endDate"].getTime() / 1000
        );
        this.setState({
            results: results,
            portfolioId: 0,
            courseId: 0
        });
    }

    // Event Handler Methods

    /*
        Set the viewed tab to the new one defined by the event
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleActiveTabChange(event) {
        this.setState({
            tab: event.target.getAttribute("value")
        });
    }

    /*
        Set the portfolioId for the survey view so that you will only view
        that portfolio's results
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handlePortfolioChange(event) {
        this.setState({
            portfolioId: parseInt(event.target["value"]),
            courseId: 0
        });
    }

    /*
        Set the courseId for the survey view so that you will only view results
        from that specific course
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleCourseChange(event) {
        this.setState({
            courseId: parseInt(event.target["value"])
        });
    }

    /*
        Set the new start date for the filter
        Params:
            date -> (Moment) the new start date
        Return:
            undefined
    */
    handleStartDateChange(date) {
        if ((typeof date) === "string") {
            return;
        }
        const results = SurveyFunctions.getQuestionResults(
            this.props["surveyEntries"],
            date.unix(),
            this.state["endDate"].getTime() / 1000
        );
        this.setState({
            results: results,
            startDate: date.toDate(),
            portfolioId: 0,
            courseId: 0
        });
    }

    /*
        Set the new end date for the filter
        Params:
            date -> (Moment) the new end date
        Return:
            undefined
    */
    handleEndDateChange(date) {
        if ((typeof date) === "string") {
            return;
        }

        const results = SurveyFunctions.getQuestionResults(
            this.props["surveyEntries"],
            this.state["startDate"].getTime() / 1000,
            date.unix()
        );
        this.setState({
            results: results,
            endDate: date.toDate(),
            portfolioId: 0,
            courseId: 0
        });
    }

    // Render Methods

    /*
        Render the portfolio/course filters and the date filters
        Params:
            none
        Return:
            JSX -> The elements to render onto the browser
    */
    renderFilters() {
        const portfolioDropdown = (
            <PortfolioDropdown
                surveyEntries={this.props["surveyEntries"]}
                portfolioId={this.state["portfolioId"]}
                eventHandler={this.handlePortfolioChange}
            />
        );
        let courseDropdown;
        if (this.state["portfolioId"] !== 0) {
            courseDropdown = (
                <CourseDropdown
                    surveyEntries={this.props["surveyEntries"]}
                    portfolioId={this.state["portfolioId"]}
                    courseId={this.state["courseId"]}
                    eventHandler={this.handleCourseChange}
                />
            );
        }
        return (
            <Row className={"survey-filters"}>
                <Col xs={3}>
                    {portfolioDropdown}
                </Col>
                <Col xs={3}>
                    {courseDropdown}
                </Col>
                <DateFilters
                    startDate={this.state["startDate"]}
                    endDate={this.state["endDate"]}
                    startDateHandler={this.handleStartDateChange}
                    endDateHandler={this.handleEndDateChange}
                />
            </Row>
        );
    }

    /*
        Render the tabs to allow for switching between survey results and
        user demographics
        Params:
            none
        Return:
            JSX -> The elements to render onto the browser
    */
    renderTabs() {
        return (
            <Nav tabs className={"survey-tabs"}>
                <NavItem
                    className={(this.state["tab"] === "results") ? "active" : ""}
                    onClick={this.handleActiveTabChange}
                    value={"results"}
                >
                    Results
                </NavItem>
                <NavItem
                    className={(this.state["tab"] === "demographics") ? "active" : ""}
                    onClick={this.handleActiveTabChange}
                    value={"demographics"}
                >
                    Demographics
                </NavItem>
            </Nav>
        );
    }

    /*
        Render the main content which will be either the survey results as charts
        or the user demographics table
        Params:
            none
        Return:
            JSX -> The elements to render onto the browser
    */
    renderMainContent() {
        return (
            <TabContent activeTab={this.state["tab"]}>
                <SurveyResults
                    results={this.state["results"]}
                    portfolioId={this.state["portfolioId"]}
                    courseId={this.state["courseId"]}
                />
                <UserDemographics
                    surveyEntries={this.props["surveyEntries"]}
                    portfolioId={this.state["portfolioId"]}
                    courseId={this.state["courseId"]}
                    startDate={this.state["startDate"].getTime() / 1000}
                    endDate={this.state["endDate"].getTime() / 1000}
                />
            </TabContent>
        );
    }

    render() {
        console.log(this.props["surveyEntries"]);
        console.log(this.state["results"]);
        if (this.props["loading"]) {
            return (
                <div className={"loading-overlay"}>
                    <Spinner className={"loading-spinner"}/>
                </div>
            );
        };

        return (
            <Container fluid={true}>
                {this.renderFilters()}
                <Row>
                    <Col>
                        {this.renderTabs()}
                    </Col>
                    <Col cs={"auto"}>
                        <ExportBtn
                            surveyEntries={this.props["surveyEntries"]}
                            portfolioId={this.state["portfolioId"]}
                            courseId={this.state["courseId"]}
                            startDate={this.state["startDate"].getTime() / 1000}
                            endDate={this.state["endDate"].getTime() / 1000}
                        />
                    </Col>
                </Row>
                {this.renderMainContent()}
            </Container>
        );
    }
}
export default Survey;
