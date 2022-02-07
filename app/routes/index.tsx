import {Link} from "remix"

export default function Index() {
  return (
    <div style={{fontFamily: "system-ui, sans-serif", lineHeight: "1.4"}}>
      <div>
        <h2>Blog explanation</h2>
        <Link to="blog">Read the blog</Link>
        <p>
          In my blog I write about different topicy that come to my mind or that I want to explore
          more. And you can follow alony my journey
        </p>
      </div>
      <div>
        <h2>Today I learned (TIL)explanation</h2>
        <Link to="til">Read what I learned today</Link>
        <p>
          In TIL I try to blog every day about something that I learned today. Usually that is
          something from programming, but could also be something absolutely unrelated.
        </p>
      </div>
    </div>
  )
}
