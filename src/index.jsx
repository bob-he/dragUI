import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import classNames from 'classnames'
import './style.css'

export default createClass({
  propTypes: {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.any,
    mask: PropTypes.bool,
    onDrag: PropTypes.func,
    axis: PropTypes.string,
    range: PropTypes.array,
    leftWay: PropTypes.bool,
    rightWay: PropTypes.bool,
    topWay: PropTypes.bool,
    bottomWay: PropTypes.bool
  },

  getInitialState() {
    return {
      axisX: 0,
      axisY: 0
    }
  },

  componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUp)
  },

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleOnMousemove)
  },

  handleOnMousemove(e) {
    let axisX = e.pageX - this.state.pageX
    let axisY = e.pageY - this.state.pageY
    if (axisX < -this.state.left) {
      return
    }
    if (axisX > this.state.right) {
      return
    }
    if (axisY < -this.state.top) {
      return
    }
    if (axisY > this.state.bottom) {
      return
    }
    this.setState({
      axisX: axisX,
      axisY: axisY
    }, () => {
      if (typeof this.props.onDrag === 'function') {
        this.props.onDrag(axisX, axisY)
      }
    })
  },

  onMouseDown(e) {
    if (e.button === 2 || e.button === 3) {
      return
    }
    const node = e.target
    const parentNode = node.parentNode
    const clientRight = parentNode.clientWidth - node.clientLeft - node.clientWidth
    const clientBottom = parentNode.clientHeight - node.clientTop - node.clientHeight
    const {range} = this.props
    this.setState({
      left: (range ? (range[3] || node.clientLeft) : node.clientLeft) || 100,
      top: (range ? (range[0] || node.clientTop) : node.clientTop) || 100,
      right: (range ? (range[1] || clientRight) : clientRight) || 100,
      bottom: (range ? (range[2] || clientBottom) : clientBottom) || 100,
      pageX: e.pageX,
      pageY: e.pageY,
    }, () => {
      if (!this.moveHandler) {
        this.moveHandler = true
        window.addEventListener('mousemove', this.handleOnMousemove)
      }
    })
  },

  onMouseUp() {
    this.setState({
      axisX: 0,
      axisY: 0
    }, () => {
      window.removeEventListener('mousemove', this.handleOnMousemove)
      this.moveHandler = false
    })
  },

  render: function() {
    let {axisX, axisY} = this.state
    const {style, axis, leftWay, rightWay, topWay, bottomWay, className} = this.props
    if (axis === 'x') {
      if (leftWay && !rightWay && axisX > 0) {
        axisX = 0
      }
      if (rightWay && !leftWay && axisX < 0) {
        axisX = 0
      }
      axisY = 0
    }
    if (axis === 'y') {
      if (topWay && !bottomWay && axisY > 0) {
        axisY = 0
      }
      if (bottomWay && !topWay && axisY < 0) {
        axisY = 0
      }
      axisX = 0
    }
    const dragStyle = Object.assign({}, style, {
      transform: `translate(${axisX}px, ${axisY}px)`
    })
    let drag = (
      <div
        className={classNames('drag-bar', className)}
        style={dragStyle}
        onMouseUp={this.onMouseUp}
        onMouseDown={this.onMouseDown}
      >
        {this.props.children}
      </div>
    )
    if (this.props.mask) {
      drag = (
        <div className={classNames('drag-wrap', className)}>
          {drag}
        </div>
      )
    }
    return drag
  }
})
