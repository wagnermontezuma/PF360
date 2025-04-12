import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Rotas que não precisam de autenticação
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Verificar se a rota atual é pública
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Se for uma rota pública, não precisa verificar autenticação
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Se não houver token e não for uma rota pública, redirecionar para login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  try {
    // Decodifica o token para verificar role e expiração
    const decoded: any = jwtDecode(token);
    
    // Verificar se o token expirou
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Token expirado, redirecionar para login
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    // Verificar se o usuário tem a role necessária (apenas staff ou admin permitidos)
    if (!['STAFF', 'ADMIN'].includes(decoded.role)) {
      // Usuário não tem permissão
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Autenticado e autorizado, continua
    return NextResponse.next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    // Erro ao decodificar o token, redirecionar para login
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
}

// Configurar quais rotas devem passar pelo middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}; 