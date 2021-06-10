import React from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
import { Router } from '@reach/router'
import FancyDiv from 'components/FancyDiv'
import Dynamic from 'containers/Dynamic'
import './app.css'
import PageWrapper from 'components/PageWrapper'

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic'])

function App() {
  return (
    <Root>
      <div className="content">
        <FancyDiv>
          <React.Suspense fallback={<em>Loading...</em>}>
            <PageWrapper>
              <Router>
                <Dynamic path="dynamic" />
                <Routes path="*" />
              </Router>
            </PageWrapper>
          </React.Suspense>
        </FancyDiv>
      </div>
    </Root>
  )
}

export default App
