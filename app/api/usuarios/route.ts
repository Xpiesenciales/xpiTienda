import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json({ success: true, data: usuarios });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al obtener datos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nuevoUsuario = await prisma.usuario.create({
      data: { 
        nombre: body.nombre, 
        email: body.email 
      },
    });
    return NextResponse.json({ success: true, data: nuevoUsuario });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al crear usuario' }, { status: 500 });
  }
}