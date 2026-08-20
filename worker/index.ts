import levelRoots from '../src/assets/level.json'
import {
  buildAreaDatasetFromLevelTree,
  createDefaultFieldConfigs,
  createDefaultGeneratorOptions,
  generateIdentityRowsFromDataset,
  toJsonRecord,
} from '../src/utils/identity-generator'

const AREA_DATASET = buildAreaDatasetFromLevelTree(levelRoots)

const JSON_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
}

function jsonResponse(payload: Record<string, string>, status = 200): Response {
  return Response.json(payload, {
    status,
    headers: JSON_HEADERS,
  })
}

function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: message }, status)
}

async function handleRandomIdentity(): Promise<Response> {
  const options = createDefaultGeneratorOptions()
  options.count = 1

  const fieldConfigs = createDefaultFieldConfigs()
  const [row] = await generateIdentityRowsFromDataset(options, AREA_DATASET)

  if (!row) {
    return errorResponse('人员信息生成失败', 500)
  }

  return jsonResponse(toJsonRecord(row, fieldConfigs))
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...JSON_HEADERS,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
      })
    }

    if (request.method !== 'GET') {
      return new Response(null, {
        status: 405,
        headers: {
          ...JSON_HEADERS,
          Allow: 'GET, OPTIONS',
        },
      })
    }

    if (url.pathname === '/api/random' || url.pathname === '/api/random/') {
      return handleRandomIdentity()
    }

    return errorResponse('接口不存在', 404)
  },
}
