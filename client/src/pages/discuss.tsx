import React from 'react'
import { useRouteData } from 'react-static'
import { IPoll } from 'types'

export default () => {
  const { polls }: { polls: IPoll[] } = useRouteData()

  return (
    <div>
      <ul>
        {Array.isArray(polls) &&
          polls.map(({ comments }) =>
            comments.log.map((comment) => (
              <li key={comment.id}>
                <p>{comment}</p>
              </li>
            )),
          )}
      </ul>
    </div>
  )
}
