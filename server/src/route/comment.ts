import express from 'express'
import { getDocumentById, getDocumentsByQuery } from '../middleware/documentGetters'
import { removeDocument } from '../middleware/documentRemovers'
import { setPatchDocument, setPostDocument } from '../middleware/documentSetters'
import isAuthed from '../middleware/isAuthed'
import { handleResponse } from '../middleware/responseHandler'
import { userOwnsDocument } from '../middleware/userOwnsResource'
import voteRoutes from './vote'
import { body, param, query } from 'express-validator'
import { ObjectId } from 'mongodb'

const router = express.Router({ mergeParams: true })

router.post(
  '/',
  body('content.text').isString().escape(),
  body('path.*.collectionName').isString(),
  body('path.*.documentId')
    .isMongoId()
    .customSanitizer((value) => new ObjectId(value)),
  isAuthed,
  setPostDocument,
  handleResponse,
)

router.get(
  '/',
  query('ids.*')
    .optional()
    .isMongoId()
    .customSanitizer((value) => (Array.isArray(value) ? value : [value])),
  query('beforeDate')
    .optional()
    .isDate()
    .customSanitizer((value) => new Date(value)),
  query('beforeDatePath').optional().escape(),
  query('afterDate')
    .optional()
    .isDate()
    .customSanitizer((value) => new Date(value)),
  query('afterDatePath').optional().escape(),
  query('limit')
    .optional()
    .isNumeric()
    .customSanitizer((value) => parseInt(value)),
  getDocumentsByQuery,
  handleResponse,
)

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
  body('content.text').isString().escape(),
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

router.use(
  '/:commentId/vote',
  param('commentId')
    .isMongoId()
    .customSanitizer((value) => new ObjectId(value)),
  voteRoutes,
)

export default router
