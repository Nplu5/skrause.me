import {Links, LiveReload, Meta, NavLink, Outlet, Scripts, ScrollRestoration} from "remix"
import type {MetaFunction} from "remix"

export const meta: MetaFunction = () => {
  return {title: "New Remix App"}
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <nav>
            <h1 style={{display: "inline"}}>Skrause.me</h1>
            <NavLink to="/">Home</NavLink>
            <NavLink to="blog">Blog</NavLink>
            <NavLink to="til">TIL</NavLink>
            <NavLink to="about">About me</NavLink>
          </nav>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}
