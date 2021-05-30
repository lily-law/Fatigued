import express from 'express'
import { getDocumentById, getDocumentsByQuery } from '../middleware/documentGetters'
import { handleDocumentResponse } from '../middleware/responseHandler'

const router = express.Router()

router.get('/', getDocumentsByQuery, handleDocumentResponse)

router.get('/:id', getDocumentById, handleDocumentResponse)
