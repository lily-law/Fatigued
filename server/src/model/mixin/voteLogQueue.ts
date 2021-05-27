// @ts-nocheck
import Vote from '../vote'

export default class VoteLogQueue {
  addVote(vote: Vote) {
    this.votes.log = [vote, ...this.votes.log.slice(0, 19)]
    this.votes.count++
    this.votes.timeUpdated = new Date()
  }
  removeVote(vote: Vote) {
    const logLength = this.votes.log.length
    if (logLength > 0) {
      let newVotesLog = this.votes.log.filter(({ _id }) => vote._id.toHexString() !== _id.toHexString())
      if (newVotesLog.length < logLength) {
        this.votes.count = [...newVotesLog, vote]
        this.votes.count--
        this.votes.timeUpdated = new Date()
      }
    }
  }
  updateVote(vote: Vote) {
    const logLength = this.votes.log.length
    if (logLength > 0) {
      let newVotesLog = this.votes.log.filter(({ _id }) => vote._id.toHexString() !== _id.toHexString())
      if (newVotesLog.length < logLength) {
        this.votes.log = [vote, ...newVotesLog.slice(0, 19)]
        this.votes.timeUpdated = new Date()
      }
    }
  }
}
