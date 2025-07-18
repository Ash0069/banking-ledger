import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define the custom payload type
interface CustomJwtPayload {
  userId: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in .env');
}

// The secret key must be encoded for jose
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {

  const authHeader = req.headers.get('authorization');
  const cookieToken = req.cookies.get('authToken')?.value;

  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7); // Extract token from 'Bearer <token>'
  } else if (cookieToken) {
    token = cookieToken;
  }

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secretKey) as { payload: CustomJwtPayload };

    // Attach decoded user info to the request for use in API routes
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', payload.userId);

    // Proceed to the next route with updated headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

// Configure middleware to run on specific routes
export const config = {
  matcher: '/api/protected/:path*', // Apply to all routes under /api/protected
};