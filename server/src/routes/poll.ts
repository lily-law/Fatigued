import express from 'express'
import { getDocumentById, getDocumentsByQuery } from '../middleware/documentGetters'
import { removeDocument } from '../middleware/documentRemovers'
import { setPatchDocument, setPostDocument } from '../middleware/documentSetters'
import { documentsToResData } from '../middleware/doucmentsToResData'
import { handleDeleteDocumentResponse, handleGetDocumentResponse, handlePatchDocumentResponse, handlePostDocumentResponse } from '../middleware/responseHandler'

const router = express.Router()

router.post('/', setPostDocument, documentsToResData, handlePostDocumentResponse)

router.get('/', getDocumentsByQuery, documentsToResData, handleGetDocumentResponse)

router.get('/:id', getDocumentById, documentsToResData, handleGetDocumentResponse)

router.patch('/:id', setPatchDocument, documentsToResData, handlePatchDocumentResponse)

router.delete('/:id', removeDocument, documentsToResData, handleDeleteDocumentResponse)

router.use('/:id/vote')

router.use('/:id/comment')