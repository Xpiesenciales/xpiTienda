import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambialo_en_produccion';

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
        isActive: true,
      },
      select: {
        id: true,
        nombre: true,
        username: true,
        email: true,
        password: true,
        rol: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    await prisma.usuario.update({
      where: { id: usuario.id },
       { lastLogin: new Date() },
    });

    const token = jwt.sign(
      { userId: usuario.id, username: usuario.username, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...usuarioSinPassword } = usuario;

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      token,
      usuario: usuarioSinPassword,
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ success: false, error: 'Error en el servidor' }, { status: 500 });
  }
}