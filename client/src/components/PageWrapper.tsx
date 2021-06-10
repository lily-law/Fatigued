import React from 'react'
import { Link } from '@reach/router'

const PageWrapper: React.FC = ({ children }) => {
  return (
    <>
      <header>
        <h1>Fatigued</h1>
        <button>?</button>
        <button>login/register</button>
        <form action="#" role="search">
          <label htmlFor="orderBy">Order by:</label>
          <select id="orderBy" aria-controls="mainContent">
            <option value="latest">latest</option>
            <option value="oldest">oldest</option>
            <option value="most-voted">most voted</option>
            <option value="least-voted">least voted</option>
            <option value="most-discussed">most discussed</option>
            <option value="least-discussed">least discussed</option>
          </select>
          <label htmlFor="filter">Filter:</label>
          <select id="filter" aria-controls="mainContent">
            <option value="">None</option>
            <option value="voted">I've voted on</option>
            <option value="not-voted">I've not voted on</option>
            <option value="discussed">I've discussed</option>
            <option value="not-discussed">I've not discussed</option>
          </select>
        </form>
      </header>
      <main id="mainContent">{children}</main>
      <footer>
        <nav>
          <Link to="/">Input</Link>
          <Link to="/stats">Stats</Link>
          <Link to="/discuss">Discuss</Link>
          <Link to="/poll">New Poll</Link>
        </nav>
      </footer>
    </>
  )
}
export default PageWrapper