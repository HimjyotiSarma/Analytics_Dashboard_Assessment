// src/app/api/uploads/route.ts
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname /* clientPayload */) => {
        // ✅ Only allow JSON uploads
        return {
          allowedContentTypes: ['application/json'],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            uploadedAt: new Date().toISOString(),
            pathname,
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('✅ Upload completed')
        console.log('Blob:', blob)
        console.log('Token payload:', tokenPayload)

        // Example: You could notify your DB here
        // const { userId } = JSON.parse(tokenPayload || '{}')
        // await db.files.insert({ userId, url: blob.url })
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error('❌ Upload failed:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}
