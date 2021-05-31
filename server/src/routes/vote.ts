import express from 'express'
import { getDocumentById, getDocumentsByQuery } from '../middleware/documentGetters'
import { removeDocument } from '../middleware/documentRemovers'
import { setPatchDocument, setPostDocument } from '../middleware/documentSetters'
import isAuthed from '../middleware/isAuthed'
import { handleResponse } from '../middleware/responseHandler'
import { userOwnsDocument } from '../middleware/userOwnsResource'

const router = express.Router()

router.post('/', isAuthed, setPostDocument, handleResponse)

router.get('/', getDocumentsByQuery, handleResponse)

router.get('/:id', getDocumentById, handleResponse)

router.patch('/:id', isAuthed, userOwnsDocument, setPatchDocument, handleResponse)

router.delete('/:id', isAuthed, userOwnsDocument, removeDocument, handleResponse)
