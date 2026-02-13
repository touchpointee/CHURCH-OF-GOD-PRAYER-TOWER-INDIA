import { NextResponse } from 'next/server';
import minioClient from '@/lib/minio';

// Helper to buffer stream
async function buffer(stream: Request['body']) {
    const chunks = [];
    if (!stream) return null;
    // @ts-ignore
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('file') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files received." }, { status: 400 });
        }

        const bucketName = process.env.MINIO_BUCKET_NAME || 'church-media';

        // Ensure bucket exists
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
            const policy = {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: { AWS: ["*"] },
                        Action: ["s3:GetObject"],
                        Resource: [`arn:aws:s3:::${bucketName}/*`]
                    }
                ]
            };
            await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
        }

        // Upload all files in parallel
        const uploadPromises = files.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = Date.now() + "-" + Math.random().toString(36).substring(7) + "-" + file.name.replaceAll(" ", "_");
            const metaData = {
                'Content-Type': file.type,
            };

            await minioClient.putObject(bucketName, filename, buffer, buffer.length, metaData);

            // Construct public URL
            const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
            const host = process.env.MINIO_ENDPOINT || 'localhost';
            const port = process.env.MINIO_PORT || '9000';
            const url = `${protocol}://${host}:${port}/${bucketName}/${filename}`;

            return { success: true, url, filename: file.name };
        });

        const results = await Promise.all(uploadPromises);

        return NextResponse.json({
            success: true,
            uploads: results,
            // For backward compatibility with single file uploads
            url: results[0]?.url
        });
    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
