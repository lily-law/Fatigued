// @ts-nocheck
import Vote from '../vote'

export default class VoteMethods {
  addVote(vote: Vote) {
    for (let [option, value] of Object.entries(vote.options)) {
      if (!this._votes.options[option]?.[value]) {
        this._votes.options[option] = { [value]: { count: 0 } }
      }
      this._votes.options[option][value].count++
    }
    this._votes.count++
  }
  removeVote(vote: Vote) {
    for (let [option, value] of Object.entries(vote.options)) {
      if (!this._votes.options[option]?.[value]) {
        this._votes.options[option] = { [value]: { count: 0 } }
      }
      this._votes.options[option][value].count !== 0 && this._votes.options[option][value].count--
    }
    this._votes.count > 0 && this._votes.count--
  }
  updateVote({ oldVote, newVote }: { oldVote: Vote; newVote: Vote }) {
    this.removeVote(oldVote)
    this.addVote(newVote)
  }
}
