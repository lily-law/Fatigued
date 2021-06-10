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
                const keyVals = Object.entries(vals)
                return (
                  <div key={id + key}>
                    <h4>{key}</h4>
                    {keyVals.length === 1 ? (
                      <p>{keyVals[0][1]}</p>
                    ) : (
                      keyVals.map(([label, val]) => (
                        <div key={id + key + label}>
                          <h3>{label}</h3>
                          <progress value={val.toString()} max={votes.count} />
                        </div>
                      ))
                    )}
                  </div>
                )
              })}
            </li>
          ))}
      </ul>
    </div>
  )
}
