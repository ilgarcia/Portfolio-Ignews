import * as prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next'
import sm from '../../sm.json'

export const endpoint = sm.apiEndpoint
export const repositoryName = prismic.getRepositoryName(endpoint)

// Update the Link Resolver to match your project's route structure
export function linkResolver(doc) {


  switch (doc.type) {
    case 'post':
      return `/posts/preview/${doc.slug}`
    case 'preview':
      return `/posts/preview/${doc.slug}`
    default:
      return '/'
  }
}

// This factory function allows smooth preview setup

interface configProps {
  previewData?: any;
  req?: unknown;
}

export function createClient(config: configProps = {}) {
  const client = prismic.createClient(endpoint)

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  })

  return client
}

