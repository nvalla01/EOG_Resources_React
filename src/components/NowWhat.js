import React, {Component} from "react";
import Card from "@material-ui/core/Card";
import CardHeaderRaw from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import AvatarRaw from "@material-ui/core/Avatar";
import Plotly from 'plotly.js-dist';

const cardStyles = theme => ({
  root: {
    background: theme.palette.primary.main
  },
  title: {
    color: "white"
  }
});
const CardHeader = withStyles(cardStyles)(CardHeaderRaw);

const avatarStyles = theme => ({
  root: {
    background: theme.palette.primary.main
  },
  title: {
    color: "white"
  }
});
const Avatar = withStyles(avatarStyles)(AvatarRaw);

const styles = {
  card: {
    margin: "5% 25%"
  }
};

class NowWhat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time_x_data : [1,2],
      metrics_y_data : [300,320],
      data: [],
      visClass: {width:'90%',height:'0px'}
    }
  }
  componentDidMount() {
    this.props.onLoad();
    // this.showDroneMetrics(this.state.time_x_data, this.state.metrics_y_data);t
}
showDroneMetrics = (xData, yData) => {
  const TESTER = document.getElementById('tester');
  xData = this.customeDateFormat(xData);
  while(TESTER.data && TESTER.data.length>0)
    {
          Plotly.deleteTraces(TESTER, [0]);
    }
  Plotly.plot( TESTER, 
    [{
      x: xData,
      y: yData}], 
      { margin: { t: 0 },  xaxis: {
        title: 'Time'
      }},
      { showSendToCloud:true} );
}
customeDateFormat = (yData) => {
  return yData.map(duration =>  {
    let minutes = parseInt((duration/(1000*60))%60);
    let hours = parseInt((duration/(1000*60*60))%24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    return hours + ":" + minutes;
  });
}
componentWillReceiveProps(nextProps) {
  const {data} = nextProps.metricDetails;
  if (data) {
    let time_x_data = data.map(d => d.timestamp);
    let metrics_y_data = data.map(d => d.metric);
    this.setState({time_x_data,metrics_y_data,data, visClass: {width:'90%',height:'250px',display: 'initial'}});
    this.showDroneMetrics(time_x_data , metrics_y_data);    
  }
  }
  render() {
// const NowWhat = props => {
  const { classes } = this.props;
  return (
    <Card className={classes.card}>
      <CardHeader title="OK, Naga padmini Vallabhuni, you're all setup. Now What?" />
      <CardContent>
        <List>
          <ListItem>
            <Avatar>1</Avatar>
            <ListItemText primary="Connect to the Drone API"/>
          </ListItem>
          <ListItem>
            <Avatar>2</Avatar>
            <ListItemText primary="Create your Visualization" />
          </ListItem>
          <div id="tester" style={this.state.visClass}></div>
          <ListItem>
            <Avatar>3</Avatar>
            <ListItemText primary="Poll the API" />
          </ListItem>
          <ListItem>
            <Avatar>4</Avatar>
            <ListItemText primary="Submit Your App" />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};
};
const mapState = (state, ownProps) => {
  const {
    loading,
    name,
    weather_state_name,
    temperatureinFahrenheit,
    metricDetails
  } = state.weather;
  return {
    loading,
    name,
    weather_state_name,
    temperatureinFahrenheit,
    metricDetails
  };
};

const mapDispatch = dispatch => ({
  onLoad: () =>
    dispatch({
      type: actions.FETCH_DRONE_DETAILS
    })
});
export default connect(mapState, mapDispatch) (withStyles(styles)(NowWhat));
