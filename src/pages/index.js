import React, { useState, useEffect, useRef } from 'react'
import { graphql } from 'gatsby'
import _ from 'lodash'

import { Layout } from '../layout'
import { Bio } from '../components/bio'
import { Head } from '../components/head'
import { Category } from '../components/category'
import { Contents } from '../components/contents'

import * as ScrollManager from '../utils/scroll'
import * as Storage from '../utils/storage'
import * as IOManager from '../utils/visible'
import * as EventManager from '../utils/event-manager'
import * as Dom from '../utils/dom'

import { HOME_TITLE, CATEGORY_TYPE } from '../constants'

const DEST_POS = 316
const BASE_LINE = 80

function getDistance(currentPos) {
  return Dom.getDocumentHeight() - currentPos
}

export default ({ data, location }) => {
  const initialCount = Storage.getCount(1)
  const initialCategory = Storage.getCategory(CATEGORY_TYPE.ALL)
  const [count, setCount] = useState(initialCount)
  const countRef = useRef(count)
  const [category, setCategory] = useState(initialCategory)
  const HEADER_OFFSET_Y = 100;
  const [currentHeaderUrl, setCurrentHeaderUrl] = useState(undefined);

  const { siteMetadata } = data.site
  const { countOfInitialPost } = siteMetadata.configs
  const posts = data.allMarkdownRemark.edges
  const categories = _.uniq(posts.map(({ node }) => node.frontmatter.category))

  useEffect(() => {
    window.addEventListener(`scroll`, onScroll, { passive: false })
    IOManager.init()
    ScrollManager.init()

    return () => {
      window.removeEventListener(`scroll`, onScroll, { passive: false })
      IOManager.destroy()
      ScrollManager.destroy()
    }
  }, [])

  useEffect(() => {
    countRef.current = count
    IOManager.refreshObserver()
    Storage.setCount(count)
    Storage.setCategory(category)
  })

  useEffect(() => {
    const handleScroll = () => {
      let aboveHeaderUrl;
      const currentOffsetY = window.pageYOffset;
      const headerElements = document.querySelectorAll('.anchor-header');
      for (const elem of headerElements) {
        const { top } = elem.getBoundingClientRect();
        const elemTop = top + currentOffsetY;
        const isLast = elem === headerElements[headerElements.length - 1];
        if (currentOffsetY < elemTop - HEADER_OFFSET_Y) {
          aboveHeaderUrl &&
          setCurrentHeaderUrl(aboveHeaderUrl.split(location.origin)[1]);
          !aboveHeaderUrl && setCurrentHeaderUrl(undefined);
          break;
        } else {
          isLast && setCurrentHeaderUrl(elem.href.split(location.origin)[1]);
          !isLast && (aboveHeaderUrl = elem.href);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const selectCategory = category => {
    setCategory(category)
    ScrollManager.go(DEST_POS)
  }

  const onScroll = () => {
    const currentPos = window.scrollY + window.innerHeight
    const isTriggerPos = () => getDistance(currentPos) < BASE_LINE
    const doesNeedMore = () =>
      posts.length > countRef.current * countOfInitialPost

    return EventManager.toFit(() => setCount(prev => prev + 1), {
      dismissCondition: () => !isTriggerPos(),
      triggerCondition: () => isTriggerPos() && doesNeedMore(),
    })()
  }

  return (
    <Layout location={location} title={siteMetadata.title}>
      <Head title={HOME_TITLE} keywords={siteMetadata.keywords} />
      <Bio />
      <Category
        categories={categories}
        category={category}
        selectCategory={selectCategory}
      />
      <Contents
        posts={posts}
        countOfInitialPost={countOfInitialPost}
        count={count}
        category={category}
      />
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        configs {
          countOfInitialPost
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { ne: null }, draft: { eq: false } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200, truncate: true)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            subtitle
            category
            draft
          }
        }
      }
    }
  }
`
