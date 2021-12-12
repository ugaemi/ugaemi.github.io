import React, {useEffect} from 'react'
import {graphql} from 'gatsby'

import * as Elements from '../components/elements'
import {Layout} from '../layout'
import {Head} from '../components/head'
import {PostTitle} from '../components/post-title'
import {PostContainer} from '../components/post-container'
import {SocialShare} from '../components/social-share'
import {SponsorButton} from '../components/sponsor-button'
import {Bio} from '../components/bio'
import {PostNavigator} from '../components/post-navigator'
import {Disqus} from '../components/disqus'
import {Utterences} from '../components/utterances'
import * as ScrollManager from '../utils/scroll'

import '../styles/code.scss'
import {TableOfContents} from "../components/table-of-contents";

export default ({data, pageContext, location}) => {
  useEffect(() => {
    ScrollManager.init()
    return () => ScrollManager.destroy()
  }, [])

  const post = data.markdownRemark
  const metaData = data.site.siteMetadata
  const {title, comment, siteUrl, author, sponsor} = metaData
  const {disqusShortName, utterances} = comment
  const isTOCVisible = TableOfContents?.length > 0

  console.log(post);

  return (
    <Layout location={location} title={title}>
      <Head title={post.frontmatter.title} description={post.excerpt}/>
      <PostTitle title={post.frontmatter.title}/>
      <div>
        {isTOCVisible &&
        <div style={{
          position: 'absolute', top: 0, height: '90%', right: 'calc((100vw - 90%) / 2 * (-1))',
        }}>
          <TableOfContents items={post.tableOfContents} currentHeaderUrl={post.currentHeaderUrl}/>
        </div>}
        <div>
          <PostContainer html={post.html}/>
        </div>
      </div>
      <SocialShare title={post.frontmatter.title} author={author}/>
      {!!sponsor.buyMeACoffeeId && (
        <SponsorButton sponsorId={sponsor.buyMeACoffeeId}/>
      )}
      <Elements.Hr/>
      <Bio/>
      <PostNavigator pageContext={pageContext}/>
      {!!disqusShortName && (
        <Disqus
          post={post}
          shortName={disqusShortName}
          siteUrl={siteUrl}
          slug={pageContext.slug}
        />
      )}
      {!!utterances && <Utterences repo={utterances}/>}
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
        comment {
          disqusShortName
          utterances
        }
        sponsor {
          buyMeACoffeeId
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 280)
      html
      tableOfContents
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
