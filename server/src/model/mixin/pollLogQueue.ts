// @ts-nocheck
import Poll from '../poll'

export default class PollLogQueue {
  addPoll(poll: Poll) {
    this.polls.log = [poll, ...this.polls.log.slice(0, 19)]
    this.polls.count++
    this.polls.timeUpdated = new Date()
  }
  removePoll(poll: Poll) {
    const logLength = this.polls.log.length
    if (logLength > 0) {
      let newPollsLog = this.polls.log.filter(({ _id }) => poll._id.toHexString() !== _id.toHexString())
      if (newPollsLog.length < logLength) {
        this.polls.count = [...newPollsLog, poll]
        this.polls.count--
        this.polls.timeUpdated = new Date()
      }
    }
  }
  updatePoll(poll: Poll) {
    const logLength = this.polls.log.length
    if (logLength > 0) {
      let newPollsLog = this.polls.log.filter(({ _id }) => poll._id.toHexString() !== _id.toHexString())
      if (newPollsLog.length < logLength) {
        this.polls.log = [poll, ...newPollsLog.slice(0, 19)]
        this.polls.timeUpdated = new Date()
      }
    }
  }
}
