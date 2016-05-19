import jQuery from 'jquery';
import React from 'react';
import ApiMixin from '../../mixins/apiMixin';
import LoadingError from '../../components/loadingError';
import LoadingIndicator from '../../components/loadingIndicator';
import {t} from '../../locale';

import ReactEcharts from 'react-echarts-component';

const TopIssueTypePieChart = React.createClass({
  propTypes: {
    endpoint: React.PropTypes.string.isRequired,
    cnt: React.PropTypes.string.isRequired,
    params: React.PropTypes.object.isRequired
  },

  mixins: [
    ApiMixin
  ],
  getInitialState() {
    return {
      statsData: {},
      loading: true,
      error: false
    };
  },

  componentWillMount() {
    this.fetchData();
  },

  componentWillReceiveProps() {
    this.setState({
      loading: true,
      error: false
    }, this.fetchData);
  },

  fetchData() {
    this.api.request(this.props.endpoint, {
      query: {
      },
      success: (data) => {
        this.setState({
          statsData: data,
          loading: false,
          error: false
        });
      },
      error: () => {
        this.setState({
          loading: false,
          error: true
        });
      }
    });
  },
  // 将statData转为echart option
  getOption() {
    let legend_data = [];
    let series_data = [];
    let statsDict = {};
    for (let e in this.state.statsData) {
      e = this.state.statsData[e];
      legend_data.push(e['name']);
      series_data.push({'name': e['name'], 'value': e['value']});
      statsDict[e['name']] = e['value'];
    }
    let testOption = {
        ext: {
          'url': '/' + params.orgId + '/' + params.projectId + '/?'
        },
        title : {
            text: 'Trace类型 TOP ' + this.props.cnt + "占比情况",
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: legend_data,
            formatter: function (name) {
                return '['+ statsDict[name] +'] ' + name;
            }
        },
        series : [{
            name: 'Trace类型',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data: series_data,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    return testOption;
  },
  // Top Type图表加事件
  addClickEventToTopTypeChart(chart) {
    chart.on('click', function(params) {
      if (params && params.name) {
        let option = chart.getOption();
        let qs = jQuery.param({
          query: params.name
        });
        window.open(option.ext.url + qs, "_blank")
      }
    });
  },

  render() {
    let option = this.getOption();
    return (
      <ReactEcharts
        height={400}
        option={option} 
        onReady={this.addClickEventToTopTypeChart} />
    );
  }
});
export default TopIssueTypePieChart;