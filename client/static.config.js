import axios from 'axios'
import path from 'path'
import React from 'react'
// import { IPoll } from './types'

// Typescript support in static.config.js is not yet supported, but is coming in a future update!
const fetchInitialPolls = async () => {
  try {
    return await axios.get(
      'http://localhost:8000/poll?limit=20'
    )
  }
  catch(e) {
    if (e?.code === 'ECONNREFUSED') {
      // keep trying until server boots
      return await fetchInitialPolls()
    }
    else {
      throw e
    }
  }
}

export default {
  entry: path.join(__dirname, 'src', 'index.tsx'),
  getRoutes: async () => {
    const { data: polls } /* :{ data: IPoll[] } */ = await fetchInitialPolls()
    return [
      {
        path: '/',
        getData: () => ({
          polls,
        }),
      },
      {
        path: '/stats',
        getData: () => ({
          polls,
        }),
      },
      {
        path: '/discuss',
        getData: () => ({
          polls,
        }),
      },
    ]
  },
  plugins: [
    'react-static-plugin-typescript',
    [
      require.resolve('react-static-plugin-source-filesystem'),
      {
        location: path.resolve('./src/pages'),
      },
    ],
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-sitemap'),
  ],
  Document: ({
    Html,
    Head,
    Body,
    children,
    state: { siteData, renderMeta },
  }) => (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>{children}</Body>
    </Html>
  ),
}
