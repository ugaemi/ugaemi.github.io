import React, { useEffect } from 'react'

import { Top } from '../components/top'
import { Header } from '../components/header'
import { ThemeSwitch } from '../components/theme-switch'
import { Footer } from '../components/footer'
import { rhythm } from '../utils/typography'
import { ChannelService } from '../components/channeltalk'

import './index.scss'

export const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`

  useEffect(() => {
    const channelService = new ChannelService();

    return () => {
      channelService.boot({
        "pluginKey": "615a3fc9-f482-41f6-a671-06abc6cc2c86",
        "profile": {
          "name": "개미",
          "email": "u.gaemi@gmail.com",
          "github": "https://github.com/ugaemi"
        }
      })
    }
  })

  return (
    <React.Fragment>
      <Top title={title} location={location} rootPath={rootPath} />
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(30),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <ThemeSwitch />
        <Header title={title} location={location} rootPath={rootPath} />
        {children}
        <Footer />
      </div>
    </React.Fragment>
  )
}
