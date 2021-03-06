import React from 'react';
import ApiMixin from '../mixins/apiMixin';
import TooltipMixin from '../mixins/tooltip';

const FollowIssue = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    follower: React.PropTypes.object.isRequired
  },

  mixins: [
    ApiMixin, TooltipMixin({
      html: true,
      selector: '.tip'
    }),
  ],
  getInitialState() {
    return {
      follower: this.props.follower,
    };
  },
  componentWillReceiveProps(nextProps) {
      this.setState({
        follower: this.props.follower
      });
  },
  followIt() {
    let follower = this.state.follower;
    // 已经设置跟进人，并且跟进人是当前登陆，那么点击就是清空
    if (follower && follower.id && follower.id == window.Raven._globalContext.user.id) {
      // cancel
      follower = {
        name: '',
        email: '',
        id: null
      }
    }
    // 否则，点击就是设置当前人
    else {
      follower = {
        name: window.Raven._globalContext.user.name,
        email: window.Raven._globalContext.user.email,
        id: window.Raven._globalContext.user.id,
      };
    }
    this.api.followIt({id: this.props.id, follower: follower, follower_id: window.Raven._globalContext.user.id});
    this.setState({follower: follower});
  },
  render() {
    let username = '暂无';
    if (this.state.follower && this.state.follower.name) {
      username = this.state.follower.name;
    }
    return (
      <span>
        <a className="tip" title="跟进 / 取消跟进" onClick={this.followIt}><span className="icon fa fa-flag-checkered"></span></a>
        <div className="assign_name_hzwangzhiwei">{username}</div>
      </span>
    );
  }
});

export default FollowIssue;