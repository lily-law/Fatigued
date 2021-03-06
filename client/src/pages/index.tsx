import React from 'react'
import { useRouteData } from 'react-static'
import { IPoll } from 'types'

export default () => {
  const { polls }: { polls: IPoll[] } = useRouteData()
  return (
    <div>
      <ul>
        {Array.isArray(polls) &&
          polls.map(({ id, content, votes }) => (
            <li key={id}>
              <p>{content.text}</p>
              {Object.entries(votes.options).map(([key, vals]) => {
                const labels = Object.keys(vals)
                return (
                  <form key={id + key}>
                    <legend>{key}</legend>
                    {labels.length === 1 ? (
                      <input type="checkbox" />
                    ) : (
                      <input type="range" min={labels[0]} max={labels[labels.length]} />
                    )}
                  </form>
                )
              })}
            </li>
          ))}
      </ul>
    </div>
  )
}
