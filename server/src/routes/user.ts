import express from 'express'
import { getDocumentById, getDocumentsByQuery } from '../middleware/documentGetters'
import { removeDocument } from '../middleware/documentRemovers'
import { setPatchDocument } from '../middleware/documentSetters'
import isAuthed from '../middleware/isAuthed'
import { handleResponse } from '../middleware/responseHandler'
import { userOwnsDocument } from '../middleware/userOwnsResource'
import { body, param } from 'express-validator'
import { ObjectId } from 'mongodb'

const router = express.Router()

router.get('/', getDocumentsByQuery, handleResponse)

router.get(
  '/:id',
  param('id')
    .isMongoId()
    .customSanitizer((value) => new ObjectId(value)),
  getDocumentById,
  handleResponse,
)

router.patch(
  '/:id',
  body('profile').exists(),
  body('profile.avatar.url').optional().escape().isURL(),
  body('profile.name').optional().isString().trim().escape(),
  param('id')
    .isMongoId()
    .customSanitizer((value) => new ObjectId(value)),
  isAuthed,
  userOwnsDocument,
  setPatchDocument,
  handleResponse,
)

router.delete(
  '/:id',
  param('id')
    .isMongoId()
    .customSanitizer((value) => new ObjectId(value)),
  isAuthed,
  userOwnsDocument,
  removeDocument,
  handleResponse,
)

export default router
