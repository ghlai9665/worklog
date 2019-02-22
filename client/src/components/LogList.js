import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { getLogsQuery, deleteLogMutation } from "../queries/queries";
import Button from "@material-ui/core/Button";
// components
//import BookDetails from './BookDetails';

class LogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      logId: ""
    };
  }

  displayLogs() {
    var data = this.props.data;
    if (data.loading) {
      return <div>Loading logs...</div>;
    } else {
      /*
      // return an array of array
      return data.logs.map(date => {
        // return an array of <li> logName </li> for each date
        return date.logs.map(theLog => {
          return <li key={theLog.id}> {theLog.logName}</li>;
        });
      });*/
      return data.logs.map(date => {
        return (
          <div>
            <h1>{date.dateName}</h1>
            <h4>
              {date.logs.map(theLog => {
                return (
                  <div>
                    <li key={theLog.id}>
                      {" "}
                      {theLog.logName}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.deleteLog.bind(
                          this,
                          theLog.id,
                          date.dateName
                        )}
                      />
                    </li>
                  </div>
                );
              })}
            </h4>
          </div>
        );
      });
    }
  }

  deleteLog(id, dateName) {
    console.log("This id is: " + id);
    this.props.deleteLogMutation({
      variables: {
        logId: id,
        dateName: dateName
      },
      refetchQueries: [{ query: getLogsQuery }]
    });
    console.log("This function was run");
  }

  render() {
    return (
      <div>
        <header id="log-list">{this.displayLogs()}</header>
      </div>
    );
  }
}

//export default graphql(getLogsQuery)(LogList);
/*export default compose(
  graphql(getLogsQuery, { name: "getLogsQuery" }),
  graphql(deleteLogMutation, { name: "deleteLogMutation" })
)(LogList);*/

export default compose(
  graphql(getLogsQuery),
  graphql(deleteLogMutation, { name: "deleteLogMutation" })
)(LogList);
