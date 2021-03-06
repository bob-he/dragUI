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
    onMouseDown: PropTypes.func,
    onMouseMove: PropTypes.func,
    axis: PropTypes.string,
    range: PropTypes.array,
    leftWay: PropTypes.bool,
    rightWay: PropTypes.bool,
    topWay: PropTypes.bool,
    bottomWay: PropTypes.bool,
    stopMove: PropTypes.bool,
    dragType: PropTypes.string
  },

  getInitialState() {
    return {
      axisX: 0,
      axisY: 0
    }
  },

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleOnMousemove)
  },

  handleOnMousemove(e) {
    if (this.props.stopMove) {
      return
    }
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
    let {axis, leftWay, rightWay, topWay, bottomWay} = this.props
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
    this.setState({
      axisX: axisX,
      axisY: axisY
    }, () => {
      if (typeof this.props.onMouseMove === 'function') {
        this.props.onMouseMove(axisX, axisY)
      }
    })
  },

  onMouseDown(e) {
    document.body.style['-webkit-touch-callout'] = 'none'
    document.body.style['-webkit-user-select'] = 'none'
    document.body.style['-khtml-user-select'] = 'none'
    document.body.style['-moz-user-select'] = 'none'
    document.body.style['-ms-user-select'] = 'none'
    document.body.style['user-select'] = 'none'
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
        window.addEventListener('mouseup', this.onMouseUp)
      }
      if (typeof this.props.onMouseDown === 'function') {
        this.props.onMouseDown()
      }
    })
  },

  onMouseUp() {
    document.body.style['-webkit-touch-callout'] = ''
    document.body.style['-webkit-user-select'] = ''
    document.body.style['-khtml-user-select'] = ''
    document.body.style['-moz-user-select'] = ''
    document.body.style['-ms-user-select'] = ''
    document.body.style['user-select'] = ''
    const {axisX, axisY} = this.state
    this.setState({
      axisX: 0,
      axisY: 0
    }, () => {
      window.removeEventListener('mousemove', this.handleOnMousemove)
      this.moveHandler = false
      if (typeof this.props.onDrag === 'function') {
        this.props.onDrag(axisX, axisY)
      }
    })
  },

  render: function() {
    let {axisX, axisY} = this.state
    let {style, className, dragType} = this.props
    let customStyle = {}
    if (dragType === 'transform') {
      customStyle = {
        transform: 'translate(' + axisX + 'px, ' + axisY + 'px)'
      }
    }
    if (dragType === 'direction') {
      customStyle = {
        left: axisX,
        top: axisY
      }
    }
    let dragStyle = Object.assign({}, style, customStyle)
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
