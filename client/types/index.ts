export interface IPoll {
  id: string, 
  owner: {
    id: string
  }, 
  content: {
    text: string,
    timeUpdated: string
  }, 
  votes: {
    options: {
      [option: string]: {
        [value: string]: {
          count: number
        }
      }
    }
    count: number
    timeUpdated: string
  }
  comments: {
    log: IComment[]
    count: number
    timeUpdated: string
  }
  timeCreated: string
}

export interface IComment extends IPoll {
  parent: {
    collectionName: 'poll' | 'comment'
    documentId: string
  }
}