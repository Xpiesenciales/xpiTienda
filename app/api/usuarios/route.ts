import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// GET - Listar usuarios
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: { isActive: true },
      select: {
        id: true,
        nombre: true,
        username: true,
        email: true,
        rol: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

// POST - Crear usuario
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, username, email, password } = body;

    if (!nombre || !username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    const emailExistente = await prisma.usuario.findUnique({ where: { email } });
    if (emailExistente) {
      return NextResponse.json(
        { success: false, error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    const usernameExistente = await prisma.usuario.findUnique({ where: { username } });
    if (usernameExistente) {
      return NextResponse.json(
        { success: false, error: 'El nombre de usuario ya está en uso' },
        { status: 400 }
      );
    }

    const hashedPassword = password; // En producción, usa bcrypt

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        username,
        email,
        password: hashedPassword,
        rol: 'CLIENTE',
        isActive: true,
      },
      select: {
        id: true,
        nombre: true,
        username: true,
        email: true,
        rol: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, usuario, message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json({ success: false, error: 'Error al crear usuario' }, { status: 500 });
  }
}