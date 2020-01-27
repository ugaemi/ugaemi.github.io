module.exports = {
  title: `개미의 개발노트`,
  description: `ugaemi's dev note`,
  author: `ugaemi`,
  introduction: `Record things I want to remember`,
  siteUrl: `https://ugaemi.github.io`, // Your blog site url
  social: {
    twitter: ``,
    github: `ugaemi`, // Your GitHub account
    medium: ``,
    facebook: `100008385976768`, // Your Facebook account
  },
  icon: `content/assets/felog.png`, // Add your favicon
  keywords: [`blog`],
  comment: {
    disqusShortName: ``, // Your disqus-short-name. check disqus.com.
    utterances: `ugaemi/blog-comments`, // Your repository for archive comment
  },
  configs: {
    countOfInitialPost: 10, // Config your initial count of post
  },
  sponsor: {
    buyMeACoffeeId: `6SdTJ2r`,
  },
  share: {
    facebookAppId: `1240894782751179`, // Add facebookAppId for using facebook share feature v3.2
  },
  siteMetadata: {
    title: `개미의 개발노트`,
    author: `ugaemi`,
    description: `ugaemi's dev note`,
    siteUrl: `https://ugaemi.github.io`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-146605667-1`,
      },
    },
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        useMozJpeg: false,
        stripMetadata: true,
        defaultQuality: 75,
      },
    },
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: `https://ugaemi.github.io`,
        sitemap: `https://ugaemi.github.io/sitemap.xml`,
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
  ],
}
