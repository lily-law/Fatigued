// @ts-nocheck
import Comment from '../comment'

export default class CommentLogQueue {
  addComment(comment: Comment) {
    this.comments.log = [comment, ...this.comments.log.slice(0, 19)]
    this.comments.count++
    this.comments.timeUpdated = new Date()
  }
  removeComment(comment: Comment) {
    const logLength = this.comments.log.length
    if (logLength > 0) {
      let newCommentsLog = this.comments.log.filter(({ _id }) => comment._id.toHexString() !== _id.toHexString())
      if (newCommentsLog.length < logLength) {
        this.comments.count = [...newCommentsLog, comment]
        this.comments.count--
        this.comments.timeUpdated = new Date()
      }
    }
  }
  updateComment(comment: Comment) {
    const logLength = this.comments.log.length
    if (logLength > 0) {
      let newCommentsLog = this.comments.log.filter(({ _id }) => comment._id.toHexString() !== _id.toHexString())
      if (newCommentsLog.length < logLength) {
        this.comments.log = [comment, ...newCommentsLog.slice(0, 19)]
        this.comments.timeUpdated = new Date()
      }
    }
  }
}
