import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'

const validCollectionNames = ['comment', 'poll', 'user', 'vote'] as const
type CollectionName = typeof validCollectionNames[number]
type RootCollectionName = 'comments' | 'polls' | 'users' | 'votes'

function collectionNameByRoute(req: Request, res: Response, expectRootPath: boolean) {
  const pathStr = req.originalUrl
  // remove ? query
  // split by /
  const pathArr = pathStr.substr(0, pathStr.indexOf('?')).split('/').reverse()
  let pathsSearched = 0
  // search for latest valid collection name
  for (let path of pathArr) {
    pathsSearched++
    if (validCollectionNames.includes(path as CollectionName)) {
      // if pathsSearched % 2 === 1 then it's a collection root
      const isRootPath = pathsSearched % 2 === 1
      if (!isRootPath) {
        return path
      } else if (!expectRootPath) {
        return `${path}s`
      } else {
        throw new Error(`Was expecting to find a root path on ${path} in ${pathStr}`)
      }
    }
  }
  res.status(404).end()
}

export function pathToCollectionItem(req: Request, res: Response) {
  const id = new ObjectId(req.params.id)
  const collectionName = collectionNameByRoute(req, res, false) as CollectionName
  return { id, collectionName }
}

export function pathToCollectionRoot(req: Request, res: Response) {
  return collectionNameByRoute(req, res, true) as RootCollectionName
}
