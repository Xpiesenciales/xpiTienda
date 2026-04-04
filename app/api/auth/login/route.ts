import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
      select: {
        id: true,
        nombre: true,
        username: true,
        email: true,
        rol: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { success: false, error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      usuario,
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ success: false, error: 'Error en el servidor' }, { status: 500 });
  }
}