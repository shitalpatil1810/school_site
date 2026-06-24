import { NotFoundPage } from '@payloadcms/next/views'
import config from '@payload-config'
import { importMap } from '../importMap.js'

const NotFound = () => NotFoundPage({ config, importMap })

export default NotFound
