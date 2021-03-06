import React from "react";

import {Row, Col, Card, CardHeader} from "reactstrap";
import Datetime from "react-datetime";

import Dropdown from "../../../Forms/Dropdown";

export default function Filters(props) {
    const show = (props["showFilters"]) ? "show" : "";
    return (
        <Card className={"filters-card " + show}>
            <Row>
                <Col md={6}>
                    <Card className={"filter-card"}>
                        <CardHeader>
                            <h5>{"Portfolio"}</h5>
                        </CardHeader>
                        <Dropdown
                            value={props["portfolioId"]}
                            optionPairs={getPortfolioOptions(props["portfolios"])}
                            onChangeHandler={props["portfolioChangeHandler"]}
                        />
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className={"filter-card"}>
                        <CardHeader>
                            <h5>{"Course"}</h5>
                        </CardHeader>
                        <Dropdown
                            value={props["courseId"]}
                            optionPairs={getCourseOptions(props["courses"], props["portfolios"], props["portfolioId"])}
                            onChangeHandler={props["courseChangeHandler"]}
                        />
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Card className={"filter-card"}>
                        <CardHeader>
                            <h5>{"Start Date"}</h5>
                        </CardHeader>
                        <Datetime
                            inputProps={{
                                placeholder: "mm/dd/yyyy"
                            }}
                            className={"pai-date"}
                            value={props["startDate"]}
                            timeFormat={false}
                            isValidDate={(currentDate) => {
                                return currentDate.isBefore(props["endDate"]);
                            }}
                            onChange={props["startDateChangeHandler"]}
                        />
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className={"filter-card"}>
                        <CardHeader>
                            <h5>{"End Date"}</h5>
                        </CardHeader>
                        <Datetime
                            inputProps={{
                                placeholder: "mm/dd/yyyy"
                            }}
                            className={"pai-date"}
                            value={props["endDate"]}
                            timeFormat={false}
                            isValidDate={(currentDate) => {
                                return currentDate.isAfter(props["startDate"]);
                            }}
                            onChange={props["endDateChangeHandler"]}
                        />
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Card className={"filter-card"}>
                        <CardHeader>
                            <h5>{"Team"}</h5>
                        </CardHeader>
                        <Dropdown
                            value={props["groupId"]}
                            optionPairs={getGroupOptions(props["groups"])}
                            onChangeHandler={props["groupChangeHandler"]}
                        />
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className={"filter-card"}>
                        <CardHeader>
                            <h5>{"Organization"}</h5>
                        </CardHeader>
                        <Dropdown
                            value={props["org"]}
                            optionPairs={getOrgOptions(props["users"])}
                            onChangeHandler={props["orgChangeHandler"]}
                        />
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Card className={"filter-card"}>
                        <CardHeader>
                            <h5>{"Role With Veterans"}</h5>
                        </CardHeader>
                        <Dropdown
                            value={props["role"]}
                            optionPairs={getRoleOptions()}
                            onChangeHandler={props["roleChangeHandler"]}
                        />
                    </Card>
                </Col>
                <Col md={6}>
                </Col>
            </Row>
        </Card>
    );
};

function getPortfolioOptions(portfolios) {
    let optionPairs = [{
        label: "All Portfolios",
        value: 0,
        key: 0
    }];
    let options = [];
    for (let portfolioId in portfolios) {
        options.push({
            label: portfolios[portfolioId]["name"],
            value: portfolioId,
            key: portfolioId
        });
    }
    options.sort(sortAlphanumeric);

    return optionPairs.concat(options);
}

function getCourseOptions(courses, portfolios, portfolioId) {
    let optionPairs = [{
        label: "All Courses",
        value: 0,
        key: 0
    }];
    let options = [];
    for (let courseId in courses) {
        if (portfolioId !== 0) {
            if (portfolios[portfolioId]["courseIds"].includes(parseInt(courseId))) {
                options.push({
                    label: courses[courseId]["title"],
                    value: courseId,
                    key: courseId
                });
            }
        }
        else {
            options.push({
                label: courses[courseId]["title"],
                value: courseId,
                key: courseId
            });
        }
    }
    options.sort(sortAlphanumeric);

    return optionPairs.concat(options);
}

function getGroupOptions(groups) {
    let optionPairs = [
        {
            label: "All Learners",
            value: 0,
            key: 0
        },
        {
            label: "All Teams",
            value: -1,
            key: -1
        },
        {
            label: "No Team Affiliation",
            value: -2,
            key: -2
        }
    ];
    let options = [];
    for (let groupId in groups) {
        options.push({
            label: groups[groupId]["title"],
            value: groupId,
            key: groupId
        });
    }
    options.sort(sortAlphanumeric);

    return optionPairs.concat(options);
}

function getOrgOptions(users) {
    let optionPairs = [
        {
            label: "All Learners",
            value: "0",
            key: "0"
        },
        {
            label: "All Organizations",
            value: "-1",
            key: "-1"
        },
        {
            label: "No Organization",
            value: "-2",
            key: "-2"
        }
    ];
    let foundOrgs = [];
    let options = [];
    for (let userId in users) {
        const user = users[userId];
        if (user["organization"] && user["organization"].trim() && !foundOrgs.includes(user["organization"])) {
            foundOrgs.push(user["organization"]);
            options.push({
                label: user["organization"],
                value: user["organization"],
                key: user["organization"]
            });
        }
    }
    options.sort(sortAlphanumeric);

    return optionPairs.concat(options);
}

function getRoleOptions() {
    let optionPairs = [
        {
            label: "All Learners",
            value: "0",
            key: "0"
        },
        {
            label: "All Roles",
            value: "-1",
            key: "-1"
        },
        {
            label: "No Role",
            value: "-2",
            key: "-2"
        }
    ];
    const roles = [
        "Caregiver/Family",
        "Employer",
        "Healthcare/Mental Healthcare Provider",
        "Member of a civic, non-profit or other organization that supports Veterans",
        "Volunteer",
        "Transitioning service member or Veteran",
        "Other"
    ];
    let options = [];
    for (let i = 0; i < roles.length; ++i) {
        options.push({
            label: roles[i],
            value: roles[i],
            key: roles[i]
        });
    }
    options.sort(sortAlphanumeric);

    return optionPairs.concat(options);
}

function sortAlphanumeric(a, b) {
    const aValue = a["label"].toLowerCase();
    const bValue = b["label"].toLowerCase();

    if (aValue < bValue) {
        return -1;
    }
    if (aValue > bValue) {
        return 1;
    }

    return 0;
}
